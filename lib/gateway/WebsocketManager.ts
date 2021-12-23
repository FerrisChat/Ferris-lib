import { EventEmitter } from 'events'
import { Client } from '../Client'
import Websocket from 'ws'
import {
	Events,
	WebSocketCloseCodes,
	WebSocketEvents,
	WebSocketPayload,
	WebsocketPayloads,
	WebSocketStatus,
} from '../util/Constants'
import { FerrisError } from '../errors/FerrislibError'
import { inspect } from 'util'
import { Channel, Guild, Message, User } from '..'
import { ClientUser } from '../models/ClientUser'
import { Util } from '../util/Util'
import { OldMessage } from '../models/Message'
import { OldChannel } from '../models/Channel'

/**
 * The class the Main client {@link Client} uses for interacting with the Gateway
 * @extends EventEmitter
 */
export class WebsocketManager extends EventEmitter {
	client: Client
	gatewayUrl: string
	connection: Websocket
	status: number
	started: boolean
	heartbeatInterval: NodeJS.Timer
	lastHeartbeatAck: boolean
	lasthHeartbeatRecieved: number
	latency: number

	constructor(client: Client) {
		super()

		this.client = client
		this.gatewayUrl = null
		this.connection = null
		this.status = WebSocketStatus.IDLE
		this.started = false
		this.heartbeatInterval = null
		this.lastHeartbeatAck = false
		this.lasthHeartbeatRecieved = Infinity
		this.latency = Infinity
	}

	debug(msg: string) {
		return this.client.debug(msg, 'Websocket Manager')
	}

	private async connect() {
		if (this.connection?.readyState === Websocket.OPEN) {
			this.debug('Open Connection was Found, Continuing')
			return Promise.resolve()
		}

		this.status = WebSocketStatus.CONNECTING

		return new Promise((resolve, reject) => {
			this.debug(
				`Connecting to the Gateway with the Url: ${this.gatewayUrl}`
			)
			this.connection = new Websocket(this.gatewayUrl)

			this.connection.on('open', this._WsOnOpen.bind(this))
			this.connection.on('message', this._WsOnMsg.bind(this))
			this.connection.on('close', this._WsOnClose.bind(this))
			this.connection.on('error', this._WsOnError.bind(this))
			this.connection.on('pong', this._WsOnPong.bind(this))
			resolve(null)
		})
	}

	send(data: any) {
		if (this.connection.readyState != Websocket.OPEN) {
			this.debug(
				`Tried to send data, but no open Connection, Retrying in 30 seconds`
			)
			return setTimeout(() => this.send(data), 1000 * 30)
		}

		this.connection.send(JSON.stringify(data), (err) => {
			if (err)
				this.debug(
					`Encoutered an error sending Data packet: \n${inspect(err)}`
				)
		})
	}

	async reconnect() {
		if (this.connection && this.connection.readyState === Websocket.OPEN) {
			this.connection.terminate()
		}

		this.connection = null
		this.status = WebSocketStatus.RECONNECTING
		await new Promise((r) => setTimeout((e) => r(e), 5000))
		this.connect()
	}

	async start() {
		if (this.started) {
			throw new FerrisError('WS_ALREADY_STARTED')
		}
		this.debug('Fetching Gateway Url')
		const data = await this.client.getWsInfo()
		this.gatewayUrl = data.url
		this.debug('Starting Gateway Connection')
		this.started = true
		this.connect()
		return
	}

	startHeartbeat() {
		this.debug('Sending Heartbeat...')
		this.connection.ping(null, true, (err) => {
			if (err) this.debug('Error Sending Heartbeat')
		})

		if (this.heartbeatInterval) this.clearHeartbeatInterval()

		this.heartbeatInterval = setInterval(() => {
			this.debug('Sending Heartbeat...')
			if (this.connection.readyState === Websocket.OPEN)
				this.connection.ping(null, true, (err) => {
					if (err) this.debug('Error Sending Heartbeat')
				})
			else this.debug('Tried to send Heartbeat but no open connection.')
		}, 1000 * 45)
	}

	clearHeartbeatInterval() {
		this.debug('Clearing heartbeat interval')
		if (this.heartbeatInterval) clearInterval(this.heartbeatInterval)
		this.heartbeatInterval = null
	}

	private _WsOnClose(code, _) {
		this.debug(
			`Connection was closed with code ${code}, clearing interval...`
		)
		if (this.heartbeatInterval) this.clearHeartbeatInterval()

		if (code > 999 && code < 1020) {
			this.debug('Reconnecting from a 1xxx error code')
			return
		} else if (code > 4999 && code < 5006) {
			throw new FerrisError('GATEWAY_ERROR')
		}

		switch (code) {
			case WebSocketCloseCodes.INVALID_JSON:
				this.debug(
					'An invalid json was sent to the Gateway, reconnecting...'
				)
				break
			case WebSocketCloseCodes.IDENTIFY_OVER_1:
				this.debug('Client identified more than once, retrying')
				break
			case WebSocketCloseCodes.INVALID_TOKEN:
				throw new FerrisError('INVALID_TOKEN')
			case WebSocketCloseCodes.DATA_SENT_BEFORE_IDENTIFY:
				this.debug('Data was sent to the Gateway before Idenifying....')
				throw new FerrisError('DATA_SENT_BEFORE_IDENTIFY')
			default:
				this.debug(`Unhandled close code: ${code}`)
				return
		}
	}

	private _WsOnError(err) {
		console.error(inspect(err))
	}

	private _WsOnMsg(raw_payload) {
		let payload: WebSocketPayload
		try {
			payload = JSON.parse(raw_payload)
		} catch (e) {
			console.log(e)
		}

		if (payload === null || !payload.c)
			return this.debug('Recieved a null payload from Gateway, ignoring')

		this.client.emit(Events.RAW_WS, payload)

		switch (payload.c) {
			case WebSocketEvents.IDENTIFY_ACCEPTED:
				if (!this.client.user)
					this.client.user = new ClientUser(
						payload.d.user,
						this.client
					)
				this.status = WebSocketStatus.CONNECTED
				this.debug('Identify Recieved')
				this.startHeartbeat()
				this.debug('This Client is now ready.')
				this.client.emit(Events.READY)
				break

			case WebSocketEvents.MESSAGE_CREATE:
				const message = new Message(payload.d.message, this.client)
				const messageChanel = Util.resolveChannel(
					this.client,
					payload.d.message.channel
				)
				if (!this.client.channels.has(messageChanel.id))
					this.client.channels.set(messageChanel.id, messageChanel)
				messageChanel.messages.set(message.id, message)
				this.client.emit(Events.MESSAGE_CREATE, message)
				break

			case WebSocketEvents.MESSAGE_DELETE:
				payload.d.message.deleted = true
				let deletedMessage
				if (this.client.messages.has(payload.d.message.id_string)) {
					deletedMessage = this.client.messages
						.get(payload.d.message.id_string)
						._patch(payload.d.message)
					this.client.messages.delete(payload.d.message.id_string)
				} else if (
					this.client.channels.has(
						payload.d.message.channel_id_string
					) &&
					this.client.channels
						.get(payload.d.message.channel_id_string)
						.messages.has(payload.d.message.id_string)
				) {
					deletedMessage = this.client.channels
						.get(payload.d.message.channel_id_string)
						.messages.get(payload.d.message.id_string)
					this.client.channels
						.get(payload.d.message.channel_id_string)
						.messages.delete(payload.d.message.id_string)
				} else {
					deletedMessage = new Message(payload.d.message, this.client)
				}
				this.client.emit(Events.MESSAGE_DELETE, deletedMessage)
				break

			case WebSocketEvents.MESSAGE_UPDATE:
				const old_message = new OldMessage(payload.d.old, this.client)
				const new_message = Util.resolveMessage(
					this.client,
					payload.d.old
				)._patch(payload.d.new)

				this.client.emit(
					Events.MESSAGE_UPDATE,
					old_message,
					new_message
				)
				break

			case WebSocketEvents.CHANNEL_CREATE:
				const channel = new Channel(payload.d.channel, this.client)
				this.client.channels.set(channel.id, channel)
				this.client.emit(Events.CHANNEL_CREATE, channel)
				break

			case WebSocketEvents.CHANNEL_DELETE:
				const delChannel = Util.resolveChannel(
					this.client,
					payload.d.channel
				)
				if (this.client.channels.has(delChannel.id))
					this.client.channels.delete(delChannel.id)
				if (
					this.client.guilds
						.get(delChannel.guildId)
						.channels.has(delChannel.id)
				)
					this.client.guilds
						.get(delChannel.guildId)
						.channels.delete(delChannel.id)
				this.client.emit(Events.CHANNEL_DELETE, delChannel)
				break

			case WebSocketEvents.CHANNEL_UPDATE:
				const old_channel = new OldChannel(payload.d.old, this.client)
				const new_channel = Util.resolveChannel(
					this.client,
					payload.d.old
				)._patch(payload.d.new)
				this.client.emit(
					Events.CHANNEL_UPDATE,
					old_channel,
					new_channel
				)
				break

			case WebSocketEvents.GUILD_CREATE:
				const new_guild = new Guild(payload.d.guild, this.client)
				if (!this.client.guilds.has(new_guild.id))
					this.client.guilds.set(new_guild.id, new_guild)
				this.client.emit(Events.GUILD_CREATE, new_guild)
				break
			default:
				return this.debug(
					`Unhandled Event Recieved "${
						payload.c
					}", Data: ${JSON.stringify(payload)}`
				)
		}
	}

	private _WsOnOpen() {
		this.status = WebSocketStatus.IDENTIFYING
		this.debug('[Connected] Connected to the Gateway, Identifying...')
		this.send(WebsocketPayloads.Identify(this.client._token))
	}

	private _WsOnPong() {
		this.latency = this.lasthHeartbeatRecieved
			? Date.now() - this.lasthHeartbeatRecieved
			: Infinity
		this.debug(
			`Pong, Recieved from the Gateway (Gateway Ping: ${this.latency}ms)`
		)
		this.lasthHeartbeatRecieved = Date.now()
	}
}

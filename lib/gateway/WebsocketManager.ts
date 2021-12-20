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
import { Message, User } from '..'
import { ClientUser } from '../models/ClientUser'
import { Util } from '../util/Util'

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

	private _WsOnClose(code, reason = 'Unknown') {
		console.log(code, reason)
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
				this.client.emit(Events.READY)
				break

			case WebSocketEvents.MESSAGE_CREATE:
				const message = new Message(payload.d.message, this.client)
				if (
					this.client.channels.has(message.channelId) &&
					!this.client.channels
						.get(message.channelId)
						.messages.has(message.id)
				)
					this.client.channels
						.get(message.channelId)
						.messages.set(message.id, message)
				this.client.messages.set(message.id, message)
				this.client.emit(Events.MESSAGE_CREATE, message)
				break

			case WebSocketEvents.MESSAGE_DELETE:
				payload.d.message.deleted = true
				let deletedMessage
				if (this.client.messages.has(payload.d.message.id)) {
					deletedMessage = this.client.messages
						.get(payload.d.message.id)
						._patch(payload.d.message)
				} else if (
					this.client.channels.has(
						payload.d.message.channel_id_string
					) &&
					this.client.channels
						.get(payload.d.message.channel_id_string)
						.messages.has(payload.d.message.id)
				) {
					deletedMessage = this.client.channels
						.get(payload.d.message.channel_id_string)
						.messages.get(payload.d.message.id)
				} else {
					deletedMessage = new Message(payload.d.message, this.client)
				}
				this.client.emit(Events.MESSAGE_DELETE, deletedMessage)
				break

			case WebSocketEvents.MESSAGE_UPDATE:
				const old_message = Util.resolveMessage(
					this.client,
					payload.d.old
				)
				const new_message = new Message(payload.d.new, this.client)

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

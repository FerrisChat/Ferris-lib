import { WebsocketManager } from './WebsocketManager'
import Websocket from 'ws'
import {
	Events,
	ShardStatus,
	WebSocketCloseCodes,
	WebSocketEvents,
	WebSocketPayload,
	WebsocketPayloads,
} from '../Constants'
import EventEmitter from 'events'
import { User } from '..'

const data = { start: null, end: null }

export class Shard extends EventEmitter {
	id: number
	manager: WebsocketManager
	connection: Websocket
	connecting: boolean
	status: number
	heartbeatInterval: NodeJS.Timer
	lastHeartbeatAck: boolean
	lasthHeartbeatRecieved: number
	latency: number

	constructor(manager: WebsocketManager, id: number) {
		super()

		this.id = id

		this.manager = manager

		this.connection = null

		this.connecting = false

		this.status = ShardStatus.IDLE

		this.lastHeartbeatAck = true

		this.lasthHeartbeatRecieved = null

		this.latency = Infinity
	}

	connect() {
		const { client, gatewayUrl } = this.manager

		if (this.connection?.readyState === Websocket.OPEN) {
			this.debug('Connection was Found, Resolving')
			return Promise.resolve()
		}

		return new Promise((resolve, reject) => {
			const cleanup = () => {
				this.manager.client.removeListener(
					Events.SHARDDISCONNECTED,
					onClose
				)
				this.manager.client.removeListener(Events.SHARDREADY, onReady)
			}

			const onReady = () => {
				cleanup()
				resolve(this.connection)
			}

			const onClose = (id, code, reason) => {
				cleanup()
				console.log(reason)
				reject({ code, reason })
			}

			this.manager.client.once(Events.SHARDREADY, onReady)
			this.manager.client.once(Events.SHARDDISCONNECTED, onClose)

			this.connection = new Websocket(gatewayUrl)
			this.connecting = true
			this.status = ShardStatus.CONNECTING

			this.connection.on('open', this._WsOnOpen.bind(this))
			this.connection.on('message', this._WsOnMsg.bind(this))
			this.connection.on('close', this._WsOnClose.bind(this))
			this.connection.on('error', this._WsOnError.bind(this))
			this.connection.on('pong', this._WsOnPong.bind(this))
		})
	}

	_send(data: any) {
		if (this.connection.readyState != Websocket.OPEN) {
			this.debug(`Tried to send data, but no open Connection`)
			return setTimeout(() => this._send(data), 1000 * 30)
		}

		//console.log(JSON.stringify(data))

		this.connection.send(JSON.stringify(data), (err) => {
			if (err)
				this.debug(`Encoutered an error sending Data packet: ${err}`)
		})
	}

	_WsOnMsg(raw_payload) {
		let payload: WebSocketPayload
		try {
			payload = JSON.parse(raw_payload)
		} catch (e) {
			console.log(e)
		}

		this.manager.client.emit(Events.RAW_WS, payload)

		switch (payload.c) {
			case WebSocketEvents.IDENTIFYACCEPTED:
				data.end = Date.now()
				this.status = ShardStatus.CONNECTED
				if (!this.manager.client.user)
					this.manager.client.user = new User(
						payload.d.user,
						this.manager.client
					)
				this.debug(
					`Idenitfy Accepted, Shard is now Ready. (Identified in ${
						data.end - data.start
					}ms)`
				)
				this.manager.client.emit(Events.SHARDREADY, this.id)
				this.startHeartbeat()
				break
			default:
				this.debug(`Unhabdled Event: ${payload.c}:${payload}`)
				break
		}
	}

	async reconnect() {
		if (this.connection && this.connection.readyState === Websocket.OPEN) {
			this.connection.terminate()
		}

		this.connection = null
		this.status = ShardStatus.RECONNECTING
		await new Promise((r) => setTimeout((e) => r(e), 5000))
		this.connect()
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

	_WsOnOpen() {
		this.status = ShardStatus.IDENTIFYING
		this.debug('[Connected] Shard connected to the Gateway, Identifying...')
		data.start = Date.now()
		this._send(WebsocketPayloads.Identify(this.manager.client._token))
	}

	_WsOnPong() {
		this.latency = this.lasthHeartbeatRecieved
			? Date.now() - this.lasthHeartbeatRecieved
			: Infinity
		this.debug(
			`Pong, Recieved from the Gateway (Gateway Ping: ${this.latency}ms)`
		)
		this.lasthHeartbeatRecieved = Date.now()
	}

	_WsOnClose(code, reason = 'Unknown') {
		this.manager.client.emit(
			Events.SHARDDISCONNECTED,
			this.id,
			code,
			reason
		)
		switch (code) {
			case WebSocketCloseCodes.ABNORMAL_CLOSURE:
				this.debug('Recieved an Abnormal closure, Reconnecting...')
				this.reconnect()
				break
			default:
				this.debug(
					`Unhandled Connection Closed ${code}:Reason: ${reason}`
				)
		}
	}

	_WsOnError(err) {
		console.warn(err)
	}

	debug(message: string) {
		return this.manager.debug(message, this)
	}
}

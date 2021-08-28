import { WebsocketManager } from "./WebsocketManager";
import Websocket from "ws"
import { Events, ShardStatus, WebSocketCloseCodes } from "../Constants";
import EventEmitter from "events";

export class Shard extends EventEmitter {

    id: number;
    manager: WebsocketManager;
    connection: Websocket;
    connecting: boolean;
    status: number;


    constructor(manager: WebsocketManager, id: number) {
        super();

        this.id = id

        this.manager = manager

        this.connection = null

        this.connecting = false

        this.status = ShardStatus.IDLE
    }

    connect() {
        const { client, gatewayUrl } = this.manager

        if (this.connection?.readyState === Websocket.OPEN) {
            this.debug("Connection was Found, Resolving")
            return Promise.resolve()
        }

        return new Promise((resolve, reject) => {
            const cleanup = () => {
                this.removeListener(Events.SHARDCLOSED, onClose);
                this.removeListener(Events.SHARDREADY, onReady);
            };

            const onReady = () => {
                cleanup();
                resolve(this.connection);
            };

            const onClose = event => {
                cleanup();
                reject(event);
            };

            this.once(Events.SHARDREADY, onReady);
            this.once(Events.SHARDCLOSED, onClose);

            this.connection = new Websocket(gatewayUrl)
            this.connecting = true
            this.status = ShardStatus.CONNECTING

            this.connection.on("open", this._WsOnOpen.bind(this))
            this.connection.on("message", this._WsOnMsg.bind(this))
            this.connection.on('close', this._WsOnClose.bind(this))
            this.connection.on('error', this._WsOnError.bind(this))
        })
    }

    _WsOnMsg(raw_payload) {
        let payload
        try {
            payload = JSON.parse(raw_payload)
        } catch (e) {
            console.log(e)
        }

        console.log(payload)
    }

    _WsOnOpen() {
        this.status = ShardStatus.CONNECTED
        this.debug("[Connected]")
    }

    _WsOnClose(code) {
        switch (code) {
            default:
                this.debug(`Unhandled Connection Closed ${code}`)
        }

        this.emit(Events.SHARDCLOSED, code)
    }

    _WsOnError(err) {
        console.warn(err)
    }

    debug(message: string) {
        return this.manager.debug(message, this)
    }
}
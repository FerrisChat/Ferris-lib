import { EventEmitter } from "events";
import { Client } from "../Client";

/**
 * The class the Main client {@link Client} uses for interacting with the Gateway
 * @extends EventEmitter
 */
export class WebsocketManager extends EventEmitter {
    client: Client;

    constructor(client: Client) {
        super()

        this.client = client
    }

    async start() {

    }
}
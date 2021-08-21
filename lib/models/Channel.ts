import { Client } from "../Client";
import Base from "./Base";

/**
 * The Channel Model
 * @param {any} data The raw channel data
 * @param {Client} client The Client
 */
export class Channel extends Base {
    /**
     * The name of the channel
     * @type {string}
     */
    public name: string

    /**
     * The client for this channel
     * @type {Client}
     */
    #_client: Client;

    constructor(data: any, client: Client) {
        super(data.id);

        this._patch(data)
        this.#_client = client
    }

    _patch(data: any) {
        if ("name" in data) {
            this.name = data.name
        }
    }
}
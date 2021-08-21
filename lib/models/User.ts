import { Client } from "../Client";
import { Endpoints } from "../Constants";
import Base from "./Base";


/**
 * The user model
 * @extends Base
 */
export class User extends Base {
    /**
     * The name of the user
     * @type {string}
     */
    public name: string;

    /**
     * The guilds of the user
     * @type {unknown}
     */
    public guilds: unknown;

    /**
     * The flags of the user
     * @type {number}
     */
    public flags: number;

    /**
     * The client that this user belongs to
     * @type {Client}
     */
    #_client: Client;

    /**
     * @param {any} data The User data
     * @param {Client} client 
     */
    constructor(data: any, client: Client) {
        super(data.id);

        this._patch(data)
        this.#_client = client
    }

    /**
     * Fetches the current user and updates it
     * @returns {Promise<User>} 
     */
    fetch() {
        return this.#_client.requestHandler.request("GET", Endpoints.USER(this.Id)).then((user) => {
            this._patch(user)
            return this
        })
    }

    _patch(data: any) {
        if ("name" in data) {
            this.name = data.name
        }
        if ("guilds" in data) {
            this.guilds = data.guilds
        } else this.guilds = null
        if ("flags" in data) {
            this.flags = data.flags
        }
    }
}
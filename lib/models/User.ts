import { Client } from "../Client";
import { Endpoints } from "../Constants";
import Base from "./Base";


/**
 * The user model
 */
export class User extends Base {
    public name: string;
    public guilds: unknown;
    public flags: number;
    #_client: Client;

    constructor(data: any, client: Client) {
        super(data.id);

        this._patch(data)
        this.#_client = client
    }

    fetch() {
        return this.#_client.requestHandler.request("GET", Endpoints.USER(this.id)).then((user) => {
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
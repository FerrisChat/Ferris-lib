import { Client } from "../Client";
import { Endpoints } from "../Constants";
import Base from "./Base";

export class User extends Base {
    public name: string;
    public guilds: unknown;
    public flags: number;
    private client: Client;

    constructor(data: any, client: Client) {
        super(data.id);

        this.client = client
        this._patch(data)
    }

    fetch() {
        return this.client.requestHandler.request("GET", Endpoints.USER(this.id)).then((user) => {
            this._patch(user)
            return this
        })
    }

    _patch(data: any) {
        if ("name" in data) {
            this.name = data.name
        }
        if ("guilds" in data.guilds) {
            this.guilds = data.guilds
        } else this.guilds = null
        if ("flags" in data.flags) {
            this.flags = data.flags
        }
    }
}
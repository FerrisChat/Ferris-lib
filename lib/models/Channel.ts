import { Client } from "../Client";
import Base from "./Base";

/**
 * The Channel Model
 */
export class Channel extends Base {
    public name: string
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
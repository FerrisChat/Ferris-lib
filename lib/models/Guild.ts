import { Client } from "../Client";
import { StorageBox } from "../util/StorageBox";
import Base from "./Base";
import { Channel } from "./Channel";


/**
 * The Guild Model
 */
export class Guild extends Base {
    public ownerId: string;
    public name: string;
    public channels: StorageBox<string, Channel>;
    public members: StorageBox<string, any>;
    #_client: Client;

    constructor(data: any, client: Client) {
        super(data.id);

        this.#_client = client
    }

    _patch(data: any) {
        if ("owner_id" in data) {
            this.ownerId = data.owner_id
        }
        if ("name" in data) {
            this.name = data.name
        }
        if ("channels" in data) {
            console.log(data.channels)
        }
        if ("members" in data) {
            console.log(data.members)
        }
    }
}
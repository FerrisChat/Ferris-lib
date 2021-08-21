import { Client } from "../Client";
import { SnowFlake } from "../Constants";
import { StorageBox } from "../util/StorageBox";
import { Channel, Member } from "./"
import Base from "./Base";

/**
 * The Guild Model
 * @extends Base
 */
export class Guild extends Base {
    /**
     * The owner of the guild
     * @type {SnowFlake}
     */
    public ownerId: SnowFlake;

    /**
     * The name of the Guild
     * @type {string}
     */
    public name: string;

    /**
     * A Cache with the Channels for the Guild
     * @type {StorageBox<SnowFlake, Channel>}
     */
    public channels: StorageBox<SnowFlake, Channel>;

    /**
     * A cache with the Members for the Guild
     * @type {StorageBox<SnowFlake, Member>}
     */
    public members: StorageBox<SnowFlake, Member>;

    /**
     * The client for the Guild
     * @type {Client}
     */
    #_client: Client;

    /**
     * @param {any} data The Guild data
     * @param {Client} client 
     */
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
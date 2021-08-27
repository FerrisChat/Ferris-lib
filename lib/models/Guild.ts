import { Client } from "../Client";
import { SnowFlake } from "../Constants";
import { StorageBox } from "../util/StorageBox";
import { Channel, Member } from "./"
import Base from "./Base";
import { GuildChannel } from "./GuildChannel";

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
     * @type {StorageBox<SnowFlake, GuildChannel>}
     */
    public channels: StorageBox<SnowFlake, GuildChannel>;

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

        this._patch(data)
    }

    _patch(data: any) {
        if ("owner_id" in data) {
            this.ownerId = BigInt(data.owner_id)
        }
        if ("name" in data) {
            this.name = data.name
        }
        if ("channels" in data) {
            for (const raw_channel in data.channels) {
                const channel = new GuildChannel(this, raw_channel, this.#_client)
                this.channels.set(channel.id, channel)
            }
        }
        if ("members" in data) {
            for (const raw_member in data.members) {
                const member = new Member(raw_member, this.#_client)
                this.members.set(member.id, member)
            }
        }

        return this
    }
}
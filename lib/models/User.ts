import { Client } from "../Client";
import { Endpoints, SnowFlake } from "../Constants";
import { StorageBox } from "../util/StorageBox";
import { Base } from "./Base";
import { Guild } from "./Guild";


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

    public discriminator: number;

    /**
     * The guilds of the user
     * @type {StorageBox<SnowFlake, Guild>}
     */
    public guilds: StorageBox<SnowFlake, Guild>;

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

        this.#_client = client

        this._patch(data)
    }

    /**
     * Fetches the current user and updates it
     * @returns {Promise<User>} 
     */
    fetch(): Promise<this> {
        return this.#_client.requestHandler.request("GET", Endpoints.USER(this.id)).then((user) => {
            this._patch(user)
            return this
        })
    }

    get tag(): string {
        return this.name + "#" + this.discriminator
    }

    _patch(data: any) {
        if ("name" in data) {
            this.name = data.name
        }

        if ("flags" in data) {
            this.flags = data.flags
        }

        if ("guilds" in data && data.guilds != null) {
            this.guilds = new StorageBox()
            for (const raw_guild of data.guilds) {
                console.log(raw_guild, BigInt(raw_guild.id).toString())
                const guild = this.#_client.guilds.has(BigInt(raw_guild.id).toString()) ? this.#_client.guilds.get(BigInt(raw_guild.id).toString())._patch(raw_guild) : this.#_client.guilds.set(BigInt(raw_guild.id).toString(), new Guild(raw_guild, this.#_client)).get(BigInt(raw_guild.id).toString())
                this.guilds.set(guild.id, guild)
            }
        } else this.guilds = null

        if ("discriminator" in data) {
            this.discriminator = data.discriminator
        }


        return this
    }
}
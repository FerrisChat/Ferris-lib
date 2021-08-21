import { Client } from "../Client";
import { SnowFlake } from "../Constants";
import Base from "./Base";
import { Guild } from "./Guild";
import { User } from "./User";


/**
 * The Member Model
 * @extends Base
 */
export class Member extends Base {
    /**
     * The user data of the Member
     * @type {User}
     */
    public user: User;

    /**
     * The GuildId that this Member belongs to
     * @type {SnowFlake}
     */
    public guildId: SnowFlake;

    /**
     * The Guild that this Member is apart of
     * @type {Guild}
     */
    public guild: Guild;

    /**
     * The client that this Member belongs to
     * @type {Client}
     */
    #_client: Client;

    /**
     * @param {any} data The Member data
     * @param {Client} client 
     */
    constructor(data: any, client: Client) {
        super(data.id);

        this.#_client = client
        this._patch(data)
    }

    _patch(data: any) {
        if ("user_id" in data) {
            this.Id = data.user_id
        }
        if ("user" in data) {
            this.user = new User(data.user, this.#_client)
        } else {
            this.user = this.#_client.users.get(this.Id)
        }
        if ("guild_id" in data) {
            this.guildId = data.guild_id
        }
        if ("guild" in data) {
            this.guild = new Guild(data.guild, this.#_client)
        } else {
            this.guild = this.#_client.guilds.get(this.guildId)
        }
        if (this.guildId === null && this.guild != null) this.guildId = this.guild.Id
    }
}
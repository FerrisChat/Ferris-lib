import { Client } from "../Client";
import Base from "./Base";
import { Guild } from "./Guild";
import { User } from "./User";

export class Member extends Base {
    public userId: string;
    public user: User;
    public guildId: string;
    public guild: Guild;

    #_client: Client;
    constructor(data: any, client: Client) {
        super(data.id);

        this.#_client = client
        this._patch(data)
    }

    _patch(data: any) {
        if ("user_id" in data) {
            this.userId = data.user_id
        }
        if ("user" in data) {
            this.user = new User(data.user, this.#_client)
        } else {
            this.user = this.#_client.users.get(this.userId)
        }
        if ("guild_id" in data) {
            this.guildId = data.guild_id
        }
        if ("guild" in data) {
            this.guild = new Guild(data.guild, this.#_client)
        } else {
            this.guild = this.#_client.guilds.get(this.guildId)
        }
        if (this.guildId === null && this.guild != null) this.guildId = this.guild.id
        if (this.userId === null && this.userId != null) this.userId = this.user.id
    }
}
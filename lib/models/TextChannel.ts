import { Client } from "../Client";
import { Guild } from "./Guild";
import { GuildChannel } from "./GuildChannel";

export class TextChannel extends GuildChannel {
    constructor(guild: Guild, data: any, client: Client) {
        super(guild, data, client)
    }
}
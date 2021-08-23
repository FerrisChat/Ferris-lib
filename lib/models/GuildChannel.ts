import { Client } from "../Client";
import { Channel } from "./Channel";
import { Guild } from "./Guild";


export class GuildChannel extends Channel {
    /**
     * The Guild {@link Guild} that this Channel belongs to
     * @type {Guild}
     */
    public guild: Guild;

    constructor(guild: Guild, data: any, client: Client) {
        super(data, client)

        this.guild = guild
    }


}
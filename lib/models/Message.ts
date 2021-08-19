import { Client } from "../Client";
import Base from "./Base";


/**
 * The Message Model
 */
export class Message extends Base {
    public content: string;
    public channelId: string;

    #_client: Client;

    constructor(data: any, client: Client) {
        super(data.id);

        this.#_client = client
    }

    _patch(data: any) {
        if ("content" in data) {
            this.content = data.content
        }
        if ("channel_id" in data) {
            this.channelId = data.channel_id
        }
    }
}
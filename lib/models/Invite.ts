import { Client } from "..";
import { SnowFlake } from "../Constants";

export class Invite {
    public code: String;
    public ownerId: SnowFlake
    public guildId: SnowFlake;
    public createdAt: unknown;
    public uses: number;
    public maxUses: number;
    public maxAge: unknown;

    constructor(data: any, client: Client) {

        this._patch(data)
    }

    _patch(data: any) {
        console.log(data)
    }
}
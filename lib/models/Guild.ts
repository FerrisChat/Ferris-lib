import { Client } from "../Client";
import Base from "./Base";

export class Guild extends Base {

    constructor(data: any, client: Client) {
        super(data.id);


    }
}
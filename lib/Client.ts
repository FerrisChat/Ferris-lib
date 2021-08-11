import { EventEmitter } from "events"
import { ClientOptions, Endpoints } from "./Constants";
import { RequestHandler } from "./rest/RequestHandler";
import { StorageBox } from "./util/StorageBox";

export class Client extends EventEmitter {
    public guilds: StorageBox<string, any>;
    public users: StorageBox<string, any>;
    public requestHandler: RequestHandler;
    public options: ClientOptions;

    constructor(clientOptions: ClientOptions) {
        super();

        if (!clientOptions) throw new Error("No options were provided to the client Class")
        else if (!clientOptions.token) throw new Error("No Token was provided, Please specify one.")

        this.options = Object.assign({
            rest: {
                requestTimeout: 7,
                retryLimit: 1,
                retryAfter: 10,
                headers: {},
            }
        }, clientOptions)

        this._validateOptions()

        this.requestHandler = new RequestHandler(this)

        this.guilds = new StorageBox()

        this.users = new StorageBox()
    }

    // temp, will be removed
    public getGuild(id: string): any {
        return this.requestHandler.request("GET", Endpoints.GUILD(id)).then((guild) => {
            if (!this.guilds.has(id)) this.guilds.set(id, guild)
            return guild
        })
    }

    // the way this operates is temporary
    public getUser(id: string, options?: { cache?: boolean; force?: boolean }): any {
        if (!options.force && this.users.has(id)) return this.users.get(id)
        return this.requestHandler.request("GET", Endpoints.USER(id)).then((user) => {
            if (options.cache && !this.users.has(id)) this.users.set(id, user)
            return user
        })
    }

    private _validateOptions() {
        if (typeof this.options.token != "string") throw new TypeError("The Token Provided is not a string.")
        if (typeof this.options.rest.retryLimit != "number" || isNaN(this.options.rest.retryLimit)) {
            throw new TypeError("The Rest Retry Limit must be a number.")
        }
        if (typeof this.options.rest.requestTimeout != "number" || isNaN(this.options.rest.requestTimeout)) {
            throw new TypeError("The Request Limit must be a number.")
        }
        if (typeof this.options.rest.headers != "object") {
            throw new TypeError("The Rest Headers must be an object.")
        }
    }
}
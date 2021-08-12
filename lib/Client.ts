import { EventEmitter } from "events"
import { ClientOptions, Endpoints } from "./Constants";
import { Guild } from "./models/Guild";
import { User } from "./models/User";
import { RequestHandler } from "./rest/RequestHandler";
import { StorageBox } from "./util/StorageBox";

export class Client extends EventEmitter {
    public guilds: StorageBox<string, Guild>;
    public users: StorageBox<string, User>;
    public requestHandler: RequestHandler;
    public options: ClientOptions;

    constructor(clientOptions: ClientOptions) {
        super();

        if (!clientOptions) throw new Error("No options were provided to the client Class")
        else if (!clientOptions.token) throw new Error("No Token was provided, Please specify one.")

        this.options = Object.assign(clientOptions, {
            rest: {
                requestTimeout: 7,
                retryLimit: 1,
                retryAfter: 10,
                headers: {},
            }
        })

        this._validateOptions()

        this.requestHandler = new RequestHandler(this)

        this.guilds = new StorageBox()

        this.users = new StorageBox()
    }

    // temp, will be removed
    public fetchGuild(id: string): Promise<Guild> {
        return this.requestHandler.request("GET", Endpoints.GUILD(id)).then((guild) => {
            const fetchedGuild = new Guild(guild, this)
            if (!this.guilds.has(id)) this.guilds.set(id, fetchedGuild)
            return fetchedGuild
        })
    }

    // the way this operates is temporary
    public fetchUser(id: string, options?: { cache?: boolean; force?: boolean }): User | Promise<User> {
        if (!options.force && this.users.has(id)) return this.users.get(id)
        return this.requestHandler.request("GET", Endpoints.USER(id)).then((user) => {
            const fetchUser = new User(user, this)
            if (options.cache && !this.users.has(id)) this.users.set(id, fetchUser)
            return fetchUser
        })
    }

    private _validateOptions() {
        if (typeof this.options.token != "string") throw new TypeError("The Token Provided is not a string.")
        if (typeof this.options.rest.retryLimit != "number" || isNaN(this.options.rest.retryLimit)) {
            throw new TypeError("The Rest Retry Limit must be a number.")
        }
        if (typeof this.options.rest.requestTimeout != "number" || isNaN(this.options.rest.requestTimeout)) {
            throw new TypeError("The Request Timeout must be a number.")
        }
        if (typeof this.options.rest.headers != "object") {
            throw new TypeError("The Rest Headers must be an object.")
        }
    }
}
import { EventEmitter } from "events"
import { ClientOptions } from "./Constants";
import { RequestHandler } from "./rest/RequestHandler";

export class Client extends EventEmitter {
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
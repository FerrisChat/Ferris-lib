import fetch from "node-fetch"
import { Client } from "../Client";
import { API_VERSION, RequestMethods, Urls } from "../Constants";
import { FerrisAPIError } from "../errors/FerrisApiError";
import { HTTPError } from "../errors/HttpError";

/**
 * The class the Client uses for Interacting with the APi.
 */
export class RequestHandler {

    userAgent: string;
    baseUrl: string;
    client: Client;
    status: {
        retires: number;
    }

    constructor(client: Client) {

        this.baseUrl = Urls.Api + Urls.Base_Api + API_VERSION
        this.client = client
        this.userAgent = `FerrisLib (https://github.com/Drxckzyz/Ferris-lib, ${require('../../package.json').version})`,
            this.status = {
                retires: 0,
            }
    }

    request(method: RequestMethods, url: string, body?: any, headers: any = {}, extra_auth: boolean = false): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const startTime = Date.now()
            const reqHeaders = {
                "User-Agent": this.userAgent,
                "Authorization": this.client._token,
                ...this.client.options.rest.headers,
            };
            if (extra_auth) {
                reqHeaders["Email"] = headers["email"]
                reqHeaders["Password"] = headers["password"]
            }

            if (body) {
                reqHeaders['Content-Type'] = 'application/json';
                body = JSON.stringify(body)
            }

            const finalURL = this.baseUrl + url
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), this.client.options.rest.requestTimeout * 1000).unref()

            const res = await fetch(finalURL, {
                headers: reqHeaders,
                body: body ? body : null,
                signal: controller.signal,
                method,
            }).finally(() => clearTimeout(timeout))

            if (res.ok) {
                this.client.debug(`${method} ${url} ${res.status} ${res.statusText} (${Date.now() - startTime}ms)`, "RequestHandler")
                const result = await res.text();
                if (res.headers.get('Content-Type') === 'application/json') {
                    return resolve(JSON.parse(result))
                }
                return resolve(result)
            }

            this.client.debug(`${method} ${url} ${res.status} ${res.statusText} (${Date.now() - startTime}ms)`, "RequestHandler")
            console.log((await res.text()))
        })
    }
}
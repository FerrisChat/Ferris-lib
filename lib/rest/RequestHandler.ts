import fetch from "node-fetch"
import { Client } from "../Client";
import { API_VERSION, RequestMethods, Urls } from "../Constants";
import { FerrisAPIError } from "./FerrisApiError";
import { HTTPError } from "./HttpError";

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

    async request(method: RequestMethods, url: string, body?: any) {
        return new Promise(async (resolve, reject) => {
            const headers = {
                "User-Agent": this.userAgent,
                "Authorization": this.client.options.token,
                "Content-type": "application/json",
                ...this.client.options.rest.headers,
            };

            const finalURL = this.baseUrl + url

            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), this.client.options.rest.requestTimeout * 1000).unref()
            console.log(finalURL)
            const res = await fetch(finalURL, {
                headers,
                body: body ? JSON.stringify(body) : null,
                signal: controller.signal,
                method,
            }).finally(() => clearTimeout(timeout))

            if (res.ok) {
                console.log(res)
                resolve(this.parseResponse(res))
            }
            console.log(res.status, res.statusText)
            if (res.status === 401 || res.status === 403) {
                console.log("Invalid Something")
            } if (res.status >= 400 && res.status <= 500) {
                if (res.status === 429) return console.warn("Ratelimit")
                else if (res.status === 404) return console.warn("Whatever was requested was not found")

                let data;
                try {
                    data = await this.parseResponse(res)
                } catch (error) {
                    reject(new HTTPError(error.message, error.constructor.name, res.status, method, finalURL))
                }

                reject(new FerrisAPIError(data, res.status, method, finalURL))
            } else if (res.status >= 500 && res.status < 600) {
                if (this.status.retires >= this.client.options.rest.retryLimit) {
                    this.status.retires = 0
                    reject(new HTTPError(`The RequestHandler has reached the RetryLimit.`, "Retry Limit Reached", res.status, method, finalURL))
                    return
                }
                this.status.retires++
                await new Promise((resolve) => setTimeout(resolve, this.client.options.rest.retryAfter * 1000))
                resolve(this.request(method, url, body))
            }
        })
    }
    private parseResponse(res) {
        return res.json().catch((e) => null);
    }
}
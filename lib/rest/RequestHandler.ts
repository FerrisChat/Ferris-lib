import fetch from "node-fetch"
import { API_VERSION, RequestMethods, Urls } from "../Constants";

export class RequestHandler {

    userAgent: string;
    tempAuth: string;
    baseUrl: string;

    constructor(client: any) {

        this.baseUrl = Urls.Api + Urls.Base_Api + API_VERSION
        this.userAgent = `FerrisLib (https://github.com/Drxckzyz/Ferris-lib, ${require('../../package.json').version})`
        //this is a test token to be able interact with the api
        this.tempAuth = "MjgzNDcyODkzNDcy.9NiKkbutW_39gE8blHOnWHfFptL_4lcXgJ2OaBNykE5nYFdTzrAx_NNXrRnoCv74ybSyCn8slOIaoY0Kou_uWwJl6s9PqREScwZjZyspGkYJdiLGJzWean5THKN6uyFBiGrOXTW_jrFmFYQXuDJ1jbebVX3QcMpISkWHk2VcChUw9MXgMEntto_JsgjNIpsxzBwkWQNeIyMOp-aFN3i3hjmUh2kj245ePzRBE3mbdxoZ5C9vHJ-nu17Kc-EAogJPJCp-guV2i0CfKaAqIdCRMg7yCr-hNwYSmOWSGEwhauea1hQ8vN2zi7H0ReeQ98L537FWfPqu3xicjBCsYCETGw=="
    }

    async request(method: RequestMethods, url: string, body?: any) {
        return new Promise(async (resolve, reject) => {
            const headers = {
                "User-Agent": this.userAgent,
                "Authorization": this.tempAuth,
                "Content-type": "application/json"
            };

            const finalURL = this.baseUrl + url

            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 1000 * 30)

            const res = await fetch(finalURL, {
                headers,
                body,
                signal: controller.signal,
                method,
            }).finally(() => clearTimeout(timeout))

            if (res.ok) {
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
                    //reject(error)
                    console.error("Malformed Response")
                }

                console.error("Throw Some Api Error Here")
            } else if (res.status >= 500 && res.status < 600) {
                console.warn("Server Issuses")
            }
        })
    }
    private parseResponse(res) {
        return res.json();
    }
}
import fetch from "node-fetch"
import { API_VERSION, RequestMethods, Urls } from "../Constants";

export class RequestHandler {

    userAgent: string;
    tempAuth: string;
    baseUrl: string;

    constructor(client: any) {

        this.baseUrl = "https://fallback-api.ferrischat.hydrostaticcog.me" + Urls.Base_Api + API_VERSION
        this.userAgent = `FerrisLib (https://github.com/Drxckzyz/Ferris-lib, ${require('../../package.json').version})`
        //this is a test token to be able interact with the api
        this.tempAuth = "MA==.2gwqJT9ODJTDjwv3sfRHt0XN7NVs_B4vJLqWqKO3YBf_QDUoGJbrl1JUAhpTCd1kGV_bLNaKCI7J74YE8dRXuSZmo7yWez4UBhD4RQ55PD_5hyJsXCvt8AS19VA5KNdksFWmqpieMykSJ6P5NKOqTJKffttXwELe5WXFg_R5ZBK63HvIQifmaWXMwER-FqffcFGMyhZeA25pXIUCm-yD8thDNMy9T90Viz7nzEfiLJmKeNM8ymf6JqZjqok9txjmt201FUNQxwlPOoQOvnki-Yfj3WWxZ_3I0fo0LfEStsrs_2iqQLru0FK2hY-MdCOajNDz5V1X4MjS2_USqJ8sAw=="
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
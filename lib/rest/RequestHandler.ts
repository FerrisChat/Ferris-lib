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
        this.tempAuth = "MA==.p1TqYEW0GtJZV4nzQkyqf8oCyO3ZJiwh_2GwijO8P3O4G3UQ4bIBoq1KZYA8rB4gRFS3mlIzxCua3gwBIa7RZpVDTFLkwlBqRwylz2yxwaWJ9_JjqyvMCK8bp0paHGliDYGFvmx08pySTT-qC-UU6lhpjA-LRUeer4MwEGaPHyRpZTEkiQHuedUDEMczxKGJSmwrBAN809GpnxgoJt-zK9WVXp3GGSJu4jkGOBGNQRTQBgAlkNxysUUOImVbzWmVAT-iw7AMwhI70im0Noj0PP47MhkskMZhnzVG2755BH8IzC2-BcheamRWYkEyaNNa4dx7Qf4mdlsbi0EFjS0kkQ=="
    }

    async request(method: RequestMethods, url: string, body?: any) {
        return new Promise(async (resolve, reject) => {
            const headers = {
                "User-Agent": this.userAgent,
                "Authorization": this.tempAuth
            };

            console.log(this.baseUrl + url)

            const req = await fetch(this.baseUrl + url, {
                headers,
                body,
            })

            const data = await req.json()

            resolve(data)
        })
    }
}
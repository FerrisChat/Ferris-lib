import { Client } from '../Client'
import axios from "axios"
import { API_VERSION, RequestMethods, Urls } from '../Constants'
import { FerrisAPIError } from '../errors/FerrisApiError'
import { HTTPError } from '../errors/HttpError'

/**
 * The class the Client uses for Interacting with the APi.
 */
export class RequestHandler {
	userAgent: string
	baseUrl: string
	client: Client
	status: {
		retires: number
	};
	headers: {};

	constructor(client: Client) {
		this.baseUrl = Urls.Api + Urls.Base_Api + API_VERSION
		this.client = client
			; (this.userAgent = `FerrisLib (https://github.com/Drxckzyz/Ferris-lib, ${require('../../package.json').version
				})`),
				(this.status = {
					retires: 0,
				})
	}

	request(
		method: RequestMethods,
		url: string,
		body?: any,
		headers: any = {},
		extra_auth: boolean = false
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const startTime = Date.now()
			const reqHeaders = {
				'User-Agent': this.userAgent,
				...this.client.options.rest.headers,
			}
			if (this.client._token != undefined) reqHeaders["Authorization"] = this.client._token
			if (extra_auth) {
				reqHeaders['Email'] = headers['email']
				reqHeaders['Password'] = headers['password']
			}

			if (body) {
				reqHeaders['Content-Type'] = 'application/json'
				body = JSON.stringify(body)
			}

			const finalURL = this.baseUrl + url
			const controller = new AbortController()
			const timeout = setTimeout(
				() => controller.abort(),
				this.client.options.rest.requestTimeout * 1000
			).unref()

			try {
				const response = await axios({
					url: finalURL,
					baseURL: this.baseUrl,
					signal: controller.signal,
					headers: reqHeaders,
					method,
				}).finally(() => clearTimeout(timeout))

				this.client.debug(
					`${method} ${url} ${response.status} ${response.statusText} (${Date.now() - startTime
					}ms)`,
					'Request Handler'
				)
				return resolve(response.data)
			} catch (error) {
				if (error.response) {
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
					this.client.debug(`${method} ${url} ${error.status} ${error.statusText} (${Date.now() - startTime
						}ms)`)
				} else if (error.request) {
					console.log(error.request);
				} else {
					console.log('Error', error.message);
				}
				console.log(error)
				reject(error)
			}
		})
	}
}

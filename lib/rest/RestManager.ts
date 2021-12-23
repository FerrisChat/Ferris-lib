import { Client } from '../Client'
import axios from 'axios'
import { API_VERSION, Events, RequestMethods, Urls } from '../util/Constants'
import { FerrisAPIError } from '../errors/FerrisApiError'
import { HTTPError } from '../errors/HttpError'
import { URLSearchParams } from 'url'

/**
 * The class the Client uses for Interacting with the APi.
 */
export class RestManager {
	userAgent: string
	baseUrl: string
	client: Client
	headers: Record<string, string>
	status: {
		latency: number
		retries: number
	}

	constructor(client: Client) {
		this.baseUrl = Urls.Api + Urls.Base_Api + API_VERSION
		this.client = client
		this.userAgent = `FerrisLib (https://github.com/Drxckzyz/Ferris-lib, ${
			require('../../package.json').version
		})`
		this.status = {
			latency: Infinity,
			retries: 0,
		}
	}

	get latency(): number {
		return this.status.latency
	}

	request(
		method: RequestMethods,
		url: string,
		{
			body,
			headers = {},
			params,
		}: {
			body?: any
			headers?: Record<string, string>
			params?: any
		} = {}
	): Promise<any> {
		return new Promise(async (resolve, reject) => {
			const startTime = Date.now()
			const reqHeaders = {
				'User-Agent': this.userAgent,
				...this.client.options.rest.headers,
				...headers,
			}
			if (this.client._token != undefined)
				reqHeaders['Authorization'] = this.client._token

			if (body) {
				reqHeaders['Content-Type'] = 'application/json'
				body = JSON.stringify(body)
			}

			const queryParams = !params
				? ''
				: '?' + new URLSearchParams(params).toString()
			const finalURL = this.baseUrl + url + queryParams
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
					data: body,
				}).finally(() => clearTimeout(timeout))

				this.client.debug(
					`${method} ${url} ${response.status} ${
						response.statusText
					} (${Date.now() - startTime}ms)`,
					'Rest Manager'
				)
				this.status.latency = Date.now() - startTime
				this.client.emit(Events.RAW_REST, response.data)
				return resolve(response.data)
			} catch (error) {
				if (error.response) {
					console.log(error.response)
					this.client.debug(
						`${method} ${url} ${error.response.status} ${
							error.response.statusText
						} (${Date.now() - startTime}ms)`
					)
					reject(
						new FerrisAPIError(
							error.response.data,
							error.response.status,
							method,
							url,
							body
						)
					)
				} else if (error.request) {
					console.log(error.request)
				} else {
					console.log('C Error', error.message)
				}
				reject(null)
			}
		})
	}
}
export class FerrisAPIError extends Error {
	method: string
	path: string
	code: number
	httpStatus: number
	body: any

	constructor(error, status, method, path, body) {
		console.log(error)
		super(error.message ?? error)
		this.name = 'FerrisAPIError'

		/**
		 * The HTTP method used for the request
		 * @type {string}
		 */
		this.method = method

		/**
		 * The path of the request relative to the HTTP endpoint
		 * @type {string}
		 */
		this.path = path

		/**
		 * HTTP error code returned by Discord
		 * @type {number}
		 */
		this.code = status

		/**
		 * Http Request Body
		 * @type {any}
		 */
		this.body = body
	}
}

import { Client } from '../Client'
import { Base } from './Base'

/**
 * The Channel Model
 * @extends Base
 */
export class Channel extends Base {
	/**
	 * The name of the channel
	 * @type {string}
	 */
	public name: string

	/**
	 * The client for this channel
	 * @type {Client}
	 */
	#_client: Client

	/**
	 * @param {any} data The Channel data
	 * @param {Client} client The Client for this Channel
	 */
	constructor(data: any, client: Client, patch: boolean = true) {
		super(data.id_string)

		this.#_client = client

		if (patch) this._patch(data)
	}

	_patch(data: any) {
		if ('name' in data) {
			this.name = data.name
		}

		return this
	}
}

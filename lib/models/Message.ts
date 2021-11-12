import { Client } from '../Client'
import { SnowFlake } from '../Constants'
import { Base } from './Base'

/**
 * The Message Model
 * @extends Base
 */
export class Message extends Base {
	/**
	 * The contents of the Message
	 * @type {string}
	 */
	public content: string

	/**
	 * The ChannelId of the Message
	 * @type {SnowFlake}
	 */
	public channelId: SnowFlake

	/**
	 * The client that this message belongs to
	 * @type {Client}
	 */
	#_client: Client

	/**
	 * @param {any} data The Message data
	 * @param {Client} client
	 */
	constructor(data: any, client: Client) {
		super(data.id_string)

		this.#_client = client
	}

	_patch(data: any) {
		if ('content' in data) {
			this.content = data.content
		}
		if ('channel_id_string' in data) {
			this.channelId = data.channel_id_string
		}

		return this
	}
}

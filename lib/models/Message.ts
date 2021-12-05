import { Channel, User } from '.'
import { Client } from '../Client'
import { SnowFlake } from '../util/Constants'
import { Base } from './Base'
import { Embed } from './Embed'

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

	channel: Channel
	deleted: boolean
	authorId: SnowFlake
	author?: User
	editedAt?: string
	embeds: Array<Embed>
	nonce?: string

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
		this.deleted = false
		this.embeds = []

		if ('content' in data) {
			this.content = data.content
		}
		if ('channel_id_string' in data) {
			this.channelId = data.channel_id_string
		}
		if (this.channelId && client.channels.has(this.channelId))
			this.channel = client.channels.get(this.channelId)
		if (this.channel && !this.channel.messages.has(this.id))
			this.channel.messages.set(this.id, this)
		if ('author_id_string' in data) this.authorId = data.author_id_string
		if ('author' in data) this.author = new User(data.author, client)
		if ('embeds' in data) {
			for (const embed of data.embeds) {
				this.embeds.push(new Embed(embed))
			}
		}
		if ('nonce' in data && data.nonce != null) this.nonce = data.nonce

		this._patch(data)
	}

	_patch(data: any) {
		if ('content' in data) {
			this.content = data.content
		}
		if ('channel_id_string' in data) {
			this.channelId = data.channel_id_string
		}
		if (this.channelId && this.#_client.channels.has(this.channelId))
			this.channel = this.#_client.channels.get(this.channelId)
		if (this.channel && !this.channel.messages.has(this.id))
			this.channel.messages.set(this.id, this)
		if ('author_id_string' in data) this.authorId = data.author_id_string
		if ('author' in data) this.author = new User(data.author, this.#_client)
		if ('embeds' in data) {
			for (const embed of data.embeds) {
				this.embeds.push(new Embed(embed))
			}
		}
		if ('nonce' in data && data.nonce != null) this.nonce = data.nonce

		return this
	}
}

import { Guild, Message, StorageBox } from '..'
import { Client } from '../Client'
import {
	ChannelEditOptions,
	FetchChannelMessagesOptions,
	MessageData,
	SnowFlake,
} from '../util/Constants'
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
	public guild?: Guild
	public guildId: SnowFlake
	public messages: StorageBox<string, Message>

	/**
	 * The client for this channel
	 * @type {Client}
	 */
	#_client: Client

	/**
	 * @param {any} data The Channel data
	 * @param {Client} client The Client for this Channel
	 */
	constructor(data: any, client: Client, guild?: Guild) {
		super(data.id_string)

		this.#_client = client

		this.messages = new StorageBox(client.options.cache.messages)

		if ('name' in data) {
			this.name = data.name
		}
		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
		}
		if (guild) {
			this.guild = guild
			this.guild.channels.set(this.id, this)
		} else if (this.guildId && this.#_client.guilds.has(this.guildId)) {
			this.guild = this.#_client.guilds.get(this.guildId)
			this.guild.channels.set(this.id, this)
		}

		this._patch(data)
	}

	createMessage(messageData: MessageData): Promise<Message> {
		return this.#_client.createMessage(this.id, messageData)
	}

	delete(): Promise<any> {
		return this.#_client.deleteChannel(this.id)
	}

	edit(channelData: ChannelEditOptions) {
		return this.#_client.editChannel(this.id, channelData)
	}

	fetch(cache: boolean = true): Promise<Channel> {
		return this.#_client.fetchChannel(this.id, cache)
	}

	fetchMessages(
		options: FetchChannelMessagesOptions
	): Promise<StorageBox<SnowFlake, Message>> {
		return this.#_client
			.fetchMessages(this.id, options)
			.then((messages) => {
				this.messages = messages
				return messages
			})
	}

	_patch(data: any) {
		if ('name' in data) {
			this.name = data.name
		}

		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
		}
		if (
			this.guildId &&
			this.#_client.guilds.has(this.guildId) &&
			!this.guild
		)
			this.guild = this.#_client.guilds.get(this.guildId)
		if (this.guild && !this.guild.channels.has(this.id))
			this.guild.channels.set(this.id, this)

		return this
	}
}

export class OldChannel extends Base {
	/**
	 * The name of the channel
	 * @type {string}
	 */
	public name: string
	public guildId: SnowFlake
	/**
	 * The client for this channel
	 * @type {Client}
	 */
	#_client: Client

	/**
	 * @param {any} data The Channel data
	 * @param {Client} client The Client for this Channel
	 */
	constructor(data: any, client: Client) {
		super(data.id_string)

		this.#_client = client

		if ('name' in data) {
			this.name = data.name
		}
		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
		}

		this._patch(data)
	}

	_patch(data: any) {
		if ('name' in data) {
			this.name = data.name
		}

		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
		}
		return this
	}
}

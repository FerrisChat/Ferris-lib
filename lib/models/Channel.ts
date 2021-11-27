import { Guild } from '..';
import { Client } from '../Client'
import { EditChannelOptions, SnowFlake } from '../Constants'
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
	public name: string;
	public guild?: Guild;
	public guildId: SnowFlake;

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
		if ("guild_id_string" in data) {
			this.guildId = data.guild_id_string
			if (this.#_client.guilds.has(data.guild_id_string)) this.guild = this.#_client.guilds.get(data.guild_id_string)
		}

		this._patch(data)
	}

	delete(): Promise<any> {
		return this.#_client.deleteChannel(this.id)
	}

	edit(channelData: EditChannelOptions) {
		return this.#_client.editChannel(this.id, channelData)
	}

	fetch(cache: boolean = true): Promise<Channel> {
		return this.#_client.fetchChannel(this.id, cache)
	}

	_patch(data: any) {
		if ('name' in data) {
			this.name = data.name
		}

		return this
	}
}

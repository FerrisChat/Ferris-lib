import { Client } from '../Client'
import { SnowFlake } from '../Constants'
import { Base } from './Base'
import { Guild } from './Guild'
import { User } from './User'

/**
 * The Member Model
 * @extends Base
 */
export class Member extends Base {
	/**
	 * The user data of the Member
	 * @type {User}
	 */
	public user: User

	/**
	 * The GuildId that this Member belongs to
	 * @type {SnowFlake}
	 */
	public guildId: SnowFlake

	/**
	 * The Guild that this Member is apart of
	 * @type {Guild}
	 */
	public guild: Guild

	/**
	 * The client that this Member belongs to
	 * @type {Client}
	 */
	#_client: Client

	/**
	 * @param {any} data The Member data
	 * @param {Client} client
	 */
	constructor(data: any, client: Client, patch: boolean = true) {
		super(data.user_id_string)

		this.#_client = client

		if (patch) this._patch(data)
	}

	_patch(data: any) {
		if (this.id === this.#_client.user.id) this.user = this.#_client.user
		else if (this.#_client.users.has(this.id))
			this.user = this.#_client.users.get(this.id)

		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
			if (this.#_client.guilds.has(this.guildId))
				this.guild = this.#_client.guilds.get(this.guildId)
		}

		return this
	}
}

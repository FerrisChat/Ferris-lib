import { Client } from '../Client'
import { SnowFlake } from '../util/Constants'
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
	constructor(data: any, guild: Guild, client: Client) {
		super(data.user_id_string)

		this.#_client = client

		this.guild = guild
		this.guildId = guild.id
		this.user = client.users.get(data.user_id_string)

		this._patch(data)
	}

	addRole(roleId: SnowFlake): Promise<any> {
		return this.#_client.addRole(this.guildId, this.id, roleId)
	}

	removeRole(roleId: SnowFlake): Promise<any> {
		return this.#_client.removeRole(this.guildId, this.id, roleId)
	}

	_patch(data: any) {
		return this
	}
}

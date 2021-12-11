import { Client } from '../Client'
import { Endpoints, UserEditOptions } from '../util/Constants'
import { UserFlags } from '../util/UserFlags'
import { Base } from './Base'
import { Guild } from './Guild'

/**
 * The user model
 * @extends Base
 */
export class ClientUser extends Base {
	/**
	 * The name of the user
	 * @type {string}
	 */
	public name: string

	public discriminator: number

	/**
	 * The flags of the user
	 * @type {UserFlags}
	 */
	public flags: UserFlags

	#_me: Client
	/**
	 * @param {any} data The User data
	 * @param {Client} client
	 */
	constructor(data: any, client: Client) {
		super(data.id_string)

		this.#_me = client

		this._patch(data)
	}

	delete(): Promise<any> {
		return this.#_me.deleteMe()
	}

	edit(options: UserEditOptions): Promise<ClientUser> {
		return this.#_me.editMe(options)
	}

	/**
	 * Fetches the current user and updates it
	 * @returns {Promise<User>}
	 */
	fetch(): Promise<this> {
		return this.#_me.rest
			.request('GET', Endpoints.USER_ME())
			.then((user) => this._patch(user))
	}

	get tag(): string {
		return this.name + '#' + this.discriminator
	}

	_patch(data: any) {
		if ('name' in data) {
			this.name = data.name
		}

		if ('flags' in data) {
			this.flags = new UserFlags(data.flags)
		}

		if ('guilds' in data && data.guilds != null) {
			for (const raw_guild of data.guilds) {
				this.#_me.guilds.has(raw_guild.id_string)
					? this.#_me.guilds
							.get(raw_guild.id_string)
							?._patch(raw_guild)
					: this.#_me.guilds.set(
							raw_guild.id_string,
							new Guild(raw_guild, this.#_me)
					  )
			}
		}

		if ('discriminator' in data) {
			this.discriminator = data.discriminator
		}

		return this
	}
}

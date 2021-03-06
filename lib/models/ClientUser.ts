import { Client } from '../Client'
import { Endpoints } from '../Constants'
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
	 * @type {number}
	 */
	public flags: number

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

	/**
	 * Fetches the current user and updates it
	 * @returns {Promise<User>}
	 */
	fetch(): Promise<this> {
		return this.#_me.requestHandler
			.request('GET', Endpoints.USER(this.id))
			.then((user) => {
				this._patch(user)
				return this
			})
	}

	get tag(): string {
		return this.name + '#' + this.discriminator
	}

	_patch(data: any) {
		if ('name' in data) {
			this.name = data.name
		}

		if ('flags' in data) {
			this.flags = data.flags
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

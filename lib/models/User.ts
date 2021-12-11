import { Constants } from '..'
import { Client } from '../Client'
import { Endpoints, SnowFlake } from '../util/Constants'
import { StorageBox } from '../util/StorageBox'
import { UserFlags } from '../util/UserFlags'
import { ApiGuild } from './ApiModels/ApiGuild'
import { Base } from './Base'
import { Guild } from './Guild'

/**
 * The user model
 * @extends Base
 */
export class User extends Base {
	/**
	 * The name of the user
	 * @type {string}
	 */
	public name: string

	public discriminator: number

	/**
	 * The guilds of the user
	 * @type {StorageBox<SnowFlake, ApiGuild}
	 */
	public guilds: Array<ApiGuild>

	public bot: boolean

	/**
	 * The flags of the user
	 * @type {UserFlags}
	 */
	public flags: UserFlags

	/**
	 * The client that this user belongs to
	 * @type {Client}
	 */
	#_client: Client

	/**
	 * @param {any} data The User data
	 * @param {Client} client
	 */
	constructor(data: any, client: Client) {
		super(data.id_string ? data.id_string : data.user_id_string)

		this.guilds = new Array()

		this.#_client = client

		this._patch(data)
	}

	/**
	 * Fetches the current user and updates it
	 * @returns {Promise<User>}
	 */
	fetch(): Promise<this> {
		return this.#_client.rest
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
			this.flags = new UserFlags(data.flags)
			if (this.flags.has(Constants.UserFlags.BOT_ACCOUNT)) this.bot = true
			else this.bot = false
		}

		if ('guilds' in data && data.guilds != null) {
			for (const raw_guild of data.guilds) {
				this.guilds.push(new ApiGuild(raw_guild, this.#_client))
			}
		}

		if ('discriminator' in data) {
			this.discriminator = data.discriminator
		}

		this.#_client.users.set(this.id, this)
		return this
	}
}

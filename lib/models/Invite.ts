import { Guild, User } from '.'
import { Client } from '..'
import { SnowFlake } from '../Constants'

export class Invite {
	public code: string
	public ownerId: SnowFlake
	public guildId: SnowFlake
	public uses: number
	public maxUses: number
	public maxAge: number
	#_client: Client

	constructor(data: any, client: Client) {
		this.#_client = client

		if ('code' in data) {
			this.code = data.code
		}

		if ('owner_id_string' in data) {
			this.ownerId = data.owner_id_string
		}

		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
		}

		if ('uses' in data) {
			this.uses = data.uses
		}

		if ('max_uses' in data) {
			this.maxUses = data.max_uses
		}

		if ('max_age' in data) {
			this.maxAge = data.max_age
		}

		this._patch(data)
	}

	fetch(): Promise<Invite> {
		return this.#_client.fetchInvite(this.code)
	}

	fetchOwner(): Promise<User> | User {
		return this.#_client.fetchUser(this.ownerId, true)
	}

	get guild(): Guild {
		return this.#_client.guilds.get(this.guildId)
	}

	get owner(): User | null {
		return this.#_client.users.get(this.ownerId)
	}

	async use() {
		return this.#_client.useInvite(this.code)
	}

	_patch(data: any) {
		if ('code' in data) {
			this.code = data.code
		}

		if ('owner_id_string' in data) {
			this.ownerId = data.owner_id_string
		}

		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
		}

		if ('uses' in data) {
			this.uses = data.uses
		}

		if ('max_uses' in data) {
			this.maxUses = data.max_uses
		}

		if ('max_age' in data) {
			this.maxAge = data.max_age
		}

		return this
	}
}

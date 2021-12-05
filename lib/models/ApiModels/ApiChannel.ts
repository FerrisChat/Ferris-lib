import { Base } from '../Base'
import { Client } from '../..'
import { Endpoints } from '../../util/Constants'
import { ApiGuild } from './ApiGuild'

export class ApiChannel extends Base {
	name: string
	guild: ApiGuild
	guildId: string
	#_client: Client

	constructor(data, client, guild?: ApiGuild) {
		super(data.id)

		this.#_client = client

		if ('name' in data) this.name = data.name
		if (guild) this.guild = guild
		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
		}

		this._patch(data)
	}

	fetch(): Promise<this> {
		return this.#_client.rest
			.request('GET', Endpoints.CHANNEL(this.id))
			.then((raw) => this._patch(raw))
	}

	_patch(data) {
		if ('name' in data) this.name = data.name
		if ('guild_id_string' in data) {
			this.guildId = data.guild_id_string
		}

		return this
	}
}

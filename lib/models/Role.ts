import { Base, Client, Guild } from '..'

export class Role extends Base {
	guild?: Guild
	guildId: string
	name: string
	color: number
	position: number
	permissions: unknown
	#_client: Client

	constructor(data, client: Client) {
		super(data.id_string)

		this.#_client = client
		if ('guild_id_string' in data) this.guildId = data.guild_id_string
		if (this.#_client.guilds.has(this.guildId))
			this.guild = this.#_client.guilds.get(this.guildId)
		if ('name' in data) this.name = data.name
		if ('color' in data) this.color = data.color
		if ('position' in data) this.position = data.position
		if ('permissions' in data) console.log(data.permissions)

		this._patch(data)
	}

	_patch(data) {
		if ('guild_id_string' in data) this.guildId = data.guild_id_string
		if (this.#_client.guilds.has(this.guildId))
			this.guild = this.#_client.guilds.get(this.guildId)
		if ('name' in data) this.name = data.name
		if ('color' in data) this.color = data.color
		if ('position' in data) this.position = data.position
		if ('permissions' in data) console.log(data.permissions)

		return this
	}
}

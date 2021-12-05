import { Base } from '../Base'
import { Client } from '../..'
import { Endpoints } from '../../util/Constants'
import { ApiChannel } from './ApiChannel'
import { ApiMember } from './ApiMember'

export class ApiGuild extends Base {
	ownerId: string
	name: string
	channels: Array<ApiChannel>
	members: Array<ApiMember>
	#_client: Client

	constructor(data, client) {
		super(data.id)

		this.#_client = client
		if ('owner_id_string' in data) this.ownerId = data.owner_id_string
		if ('name' in data) this.name = data.name
		if ('channels' in data && data.channels != null) {
			for (const raw_channel of data.channels) {
				this.channels.push(
					new ApiChannel(raw_channel, this.#_client, this)
				)
			}
		}
		if ('members' in data && data.members != null) {
			for (const raw_member of data.mebers) {
				this.members.push(new ApiMember(raw_member, this.#_client))
			}
		}

		this._patch(data)
	}

	fetch(): Promise<this> {
		return this.#_client.rest
			.request('GET', Endpoints.GUILD(this.id))
			.then((raw) => this._patch(raw))
	}

	_patch(data) {
		if ('owner_id_string' in data) this.ownerId = data.owner_id_string
		if ('name' in data) this.name = data.name
		if ('channels' in data && data.channels != null) {
			for (const raw_channel of data.channels) {
				this.channels.push(raw_channel)
			}
		}
		if ('members' in data && data.members != null) {
			for (const raw_member of data.mebers) {
				this.members.push(raw_member)
			}
		}

		return this
	}
}

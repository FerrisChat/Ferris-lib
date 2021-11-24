import { Base } from '../Base'
import { Client } from '../..'

export class ApiMember extends Base {
	#_client: Client

	constructor(data, client) {
		super(data.id)

		this.#_client = client

		this._patch(data)
	}

	_patch(data) {
		return this
	}
}

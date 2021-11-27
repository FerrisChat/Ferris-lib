import { Role } from '..'
import { Client } from '../Client'
import { CreateRoleOptions, SnowFlake } from '../Constants'
import { StorageBox } from '../util/StorageBox'
import { Channel, Member } from './'
import { Base } from './Base'
import { Invite } from './Invite'

/**
 * The Guild Model
 * @extends Base
 */
export class Guild extends Base {
	/**
	 * The owner of the guild
	 * @type {SnowFlake}
	 */
	public ownerId: SnowFlake

	/**
	 * The name of the Guild
	 * @type {string}
	 */
	public name: string

	/**
	 * A Cache with the Channels for the Guild
	 * @type {StorageBox<SnowFlake, GuildChannel>}
	 */
	public channels: StorageBox<SnowFlake, Channel>

	/**
	 * A cache with the Members for the Guild
	 * @type {StorageBox<SnowFlake, Member>}
	 */
	public members: StorageBox<SnowFlake, Member>;

	public roles: StorageBox<SnowFlake, Role>;

	/**
	 * The client for the Guild
	 * @type {Client}
	 */
	#_client: Client

	/**
	 * @param {any} data The Guild data
	 * @param {Client} client
	 */
	constructor(data: any, client: Client) {
		super(data.id_string)

		this.#_client = client

		this.members = new StorageBox()

		this.channels = new StorageBox()

		this.roles = new StorageBox()

		if ('name' in data) {
			this.name = data.name
		}
		if ('owner_id_string' in data) {
			this.ownerId = data.owner_id_string
		}
		if ('channels' in data && data.channels != null) {
			for (const raw_channel of data.channels) {
				const channel = new Channel(raw_channel, this.#_client)
				this.channels.set(channel.id, channel)
			}
		}
		if ('members' in data && data.members != null) {
			for (const raw_member of data.members) {
				const member = new Member(raw_member, this.#_client)
				this.members.set(member.id, member)
			}
		}

		this._patch(data)
	}

	createRole(roleData: CreateRoleOptions): Promise<Role> {
		return this.#_client.createRole(this.id, roleData)
	}

	deleteRole(roleId: SnowFlake): Promise<any> {
		return this.#_client.deleteRole(this.id, roleId)
	}

	fetch({ fetchMembers = false, fetchChannels = true }: { fetchMembers?: boolean, fetchChannels?: boolean } = {}): Promise<Guild> {
		return this.#_client.fetchGuild(this.id, { fetchChannels, fetchMembers })
	}

	fetchInvites(): Promise<StorageBox<string, Invite>> {
		return this.#_client.fetchGuildInvites(this.id)
	}

	fetchRole(roleId: SnowFlake): Promise<Role> {
		return this.#_client.fetchRole(this.id, roleId)
	}

	_patch(data: any) {
		if ('name' in data) {
			this.name = data.name
		}
		if ('owner_id_string' in data) {
			this.ownerId = data.owner_id_string
		}
		if ('channels' in data && data.channels != null) {
			for (const raw_channel of data.channels) {
				const channel = new Channel(raw_channel, this.#_client)
				this.channels.set(channel.id, channel)
			}
		}
		if ('members' in data && data.members != null) {
			for (const raw_member of data.members) {
				const member = new Member(raw_member, this.#_client)
				this.members.set(member.id, member)
			}
		}

		return this
	}
}

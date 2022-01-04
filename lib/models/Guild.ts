import { GuildFlags, Role } from '..'
import { Client } from '../Client'
import {
	ChannelCreateOptions,
	ChannelEditOptions,
	GuildEditOptions,
	RoleCreateOptions,
	SnowFlake,
} from '../util/Constants'
import { StorageBox } from '../util/StorageBox'
import { Channel, Member } from './'
import { Base } from './Base'
import { OldChannel } from './Channel'
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

	public flags: GuildFlags

	public icon?: string

	/**
	 * A cache with the Members for the Guild
	 * @type {StorageBox<SnowFlake, Member>}
	 */
	public members: StorageBox<SnowFlake, Member>

	public roles: StorageBox<SnowFlake, Role>

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

		this.members = new StorageBox(this.#_client.options.cache.members)

		this.channels = new StorageBox(this.#_client.options.cache.channels)

		this.roles = new StorageBox(this.#_client.options.cache.roles)

		if ('name' in data) {
			this.name = data.name
		}

		if ('icon' in data && data.icon != null) {
			this.icon = data.icon
		}

		if ('owner_id_string' in data) {
			this.ownerId = data.owner_id_string
		}
		if ('channels' in data && data.channels != null) {
			for (const raw_channel of data.channels) {
				const channel = new Channel(raw_channel, this.#_client, this)
				this.channels.set(channel.id, channel)
				if (this.#_client.channels.has(channel.id))
					this.#_client.channels.get(channel.id)._patch(raw_channel)
				else this.#_client.channels.set(channel.id, channel)
			}
		}
		if ('members' in data && data.members != null) {
			for (const raw_member of data.members) {
				const member = new Member(raw_member, this.#_client)
				this.members.set(member.id, member)
			}
		}

		if (!client.guilds.has(this.id)) client.guilds.set(this.id, this)
		this._patch(data)
	}

	createChannel(channelData: ChannelCreateOptions): Promise<Channel> {
		return this.#_client.createChannel(this.id, channelData)
	}

	createRole(roleData: RoleCreateOptions): Promise<Role> {
		return this.#_client.createRole(this.id, roleData)
	}

	delete(): Promise<any> {
		return this.#_client.deleteGuild(this.id)
	}

	deleteChannel(channelId: SnowFlake): Promise<any> {
		return this.#_client.deleteChannel(channelId)
	}

	deleteRole(roleId: SnowFlake): Promise<any> {
		return this.#_client.deleteRole(this.id, roleId)
	}

	edit(guildData: GuildEditOptions): Promise<Guild> {
		return this.#_client.editGuild(this.id, guildData)
	}

	fetch({
		fetchMembers = false,
		fetchChannels = true,
	}: {
		fetchMembers?: boolean
		fetchChannels?: boolean
	} = {}): Promise<Guild> {
		return this.#_client.fetchGuild(this.id, {
			fetchChannels,
			fetchMembers,
		})
	}

	fetchChannel(
		channelId: SnowFlake,
		cache: boolean = true
	): Promise<Channel> {
		return this.#_client.fetchChannel(channelId, cache)
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
		if ('icon' in data && data.icon != null) {
			this.icon = data.icon
		}
		if ('flags' in data && data.flags != null) {
			this.flags = new GuildFlags(data.flags)
		} else {
			this.flags = null
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

export class OldGuild extends Base {
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
	 * @type {Array<SnowFlake>}
	 */
	public channels: Array<SnowFlake>;

	public flags: GuildFlags

	public icon?: string

	/**
	 * A cache with the Members for the Guild
	 * @type {Array<SnowFlake>}
	 */
	public members: Array<SnowFlake>

	public roles: Array<SnowFlake>

	/**
	 * The client for the Guild
	 * @type {Client}
	 */
	#_client: Client
	constructor(data: any, client: Client) {
		super(data.id_string)

		this.#_client = client

		if ('name' in data) {
			this.name = data.name
		}
		if ('owner_id_string' in data) {
			this.ownerId = data.owner_id_string
		}
		if ('flags' in data && data.flags != null) {
			this.flags = new GuildFlags(data.flags)
		}
		if ('channels' in data && data.channels != null) {
			this.channels = []
			for (const channel of data.channels) {
				this.channels.push(channel.id_string)
			}
		}
		if ('members' in data && data.members != null) {
			this.members = []
			for (const member of data.members) {
				this.members.push(member.id_string)
			}
		}
		if ('roles' in data && data.roles != null) {
			this.roles = []
			for (const role of data.roles) {
				this.roles.push(role.id_string)
			}
		}

		this._patch(data)
	}

	_patch(data: any) {
		if ('name' in data) {
			this.name = data.name
		}
		if ('owner_id_string' in data) {
			this.ownerId = data.owner_id_string
		}
		if ('flags' in data && data.flags != null) {
			this.flags = new GuildFlags(data.flags)
		}
		if ('channels' in data && data.channels != null) {
			this.channels = []
			for (const channel of data.channels) {
				this.channels.push(channel.id_string)
			}
		}
		if ('members' in data && data.members != null) {
			this.members = []
			for (const member of data.members) {
				this.members.push(member.id_string)
			}
		}
		if ('roles' in data && data.roles != null) {
			this.roles = []
			for (const role of data.roles) {
				this.roles.push(role.id_string)
			}
		}

		return this
	}
}
import EventEmitter from 'events'
import {
	ClientEvents,
	ClientOptions,
	ConnectOptions,
	ConnectType,
	Endpoints,
	MessageData,
	SnowFlake,
	Events,
	ChannelCreateOptions,
	GuildCreateOptions,
	RoleCreateOptions,
	ChannelEditOptions,
	GuildEditOptions,
	RoleEditOptions,
} from './util/Constants'
import { FerrisError } from './errors/FerrislibError'
import { WebsocketManager } from './gateway/WebsocketManager'
import { Message } from './models'
import { Guild } from './models/Guild'
import { User } from './models/User'
import { Channel } from './models/Channel'
import { RestManager } from './rest/RestManager'
import { StorageBox } from './util/StorageBox'
import { Invite } from './models/Invite'
import { Role } from './models/Role'
import { ClientUser } from './models/ClientUser'

/**
 * Main class for interacting with Api and Gateway
 * @param {ClientOptions} clientOptions The options for the client
 * @extends EventEmitter
 */
export class Client extends EventEmitter {
	public channels: StorageBox<SnowFlake, Channel>

	public messages: StorageBox<SnowFlake, Message>

	public user: ClientUser

	/**
	 * A cache that holds all the Users that have been cached by the client
	 * @type {StorageBox<SnowFlake, User>}
	 */
	public users: StorageBox<SnowFlake, User>

	public guilds: StorageBox<SnowFlake, Guild>

	/**
	 * The Handler {@link RestManager} used for interacting with the api
	 * @type {RestManager}
	 */
	public rest: RestManager

	/**
	 * The Manager {@link WebsocketManager} used to interacting with the Gateway
	 * @type {WebsocketManager}
	 */
	public ws: WebsocketManager

	/**
	 * The options passed to the client
	 * @type {ClientOptions}
	 */
	public options: ClientOptions

	_token: string

	/**
	 * @param {ClientOptions} clientOptions The options for the Client
	 */
	constructor(clientOptions: ClientOptions = {}) {
		super()

		this.options = Object.assign(
			{
				rest: {
					requestTimeout: 7,
					retryLimit: 1,
					retryAfter: 10,
					headers: {},
				},
				cache: {
					guilds: true,
					users: true,
					messages: true,
					members: true,
					channels: true,
					roles: true,
				},
			},
			clientOptions
		)

		this.validateOptions()

		this.rest = new RestManager(this)

		this.ws = new WebsocketManager(this)

		this.user = null

		this.users = new StorageBox(this.options.cache.users)

		this.channels = new StorageBox(this.options.cache.channels)

		this.messages = new StorageBox(this.options.cache.messages)

		this.users = new StorageBox(this.options.cache.users)

		this.guilds = new StorageBox(this.options.cache.guilds)
	}

	addRole(guildId: SnowFlake, memberId: SnowFlake, roleId: SnowFlake) {
		return this.rest.request(
			'POST',
			Endpoints.MEMBER_ROLES(guildId, memberId, roleId)
		)
	}

	createChannel(
		guildId: SnowFlake,
		channelData: ChannelCreateOptions
	): Promise<Channel> {
		if (!channelData.name)
			throw new Error('A name must be provided for Guild Creation.')
		else if (typeof channelData.name != 'string')
			throw new TypeError('Name of Guild must be a string')

		return this.rest
			.request('POST', Endpoints.CHANNELS(guildId), { body: channelData })
			.then((raw_channel) => new Channel(raw_channel, this))
	}

	createGuild(guildData: GuildCreateOptions): Promise<Guild> {
		if (!guildData.name)
			throw new Error('A name must be provided for Guild Creation.')
		else if (typeof guildData.name != 'string')
			throw new TypeError('Name of Guild must be a string')

		return this.rest
			.request('POST', Endpoints.GUILDS(), { body: guildData })
			.then((raw_guild) => new Guild(raw_guild, this))
	}

	createInvite(
		guildId: SnowFlake,
		maxAge: number,
		maxUses: number
	): Promise<Invite> {
		return this.rest
			.request('POST', Endpoints.INVITES(guildId), {
				body: {
					max_age: maxAge,
					max_uses: maxUses,
				},
			})
			.then((raw_inv) => new Invite(raw_inv, this))
	}

	createMessage(
		guildId: SnowFlake,
		channelId: SnowFlake,
		messageData: MessageData
	): Promise<Message> {
		if (!messageData.content)
			throw new Error('You must provide content for the message.')
		else if (typeof messageData.content != 'string')
			throw new TypeError('Content for Message must be a string')

		return this.rest
			.request('POST', Endpoints.MESSAGES(guildId, channelId), {
				body: messageData,
			})
			.then((raw_message) => new Message(raw_message, this))
	}

	createRole(guildId: SnowFlake, roleData: RoleCreateOptions): Promise<Role> {
		if (roleData.name && typeof roleData.name != 'string')
			throw new TypeError('Name of Role must be a string.')
		else if (roleData.color && typeof roleData.color != 'number')
			throw new TypeError('Color of Role must be a number.')
		else if (roleData.position && typeof roleData.position != 'number')
			throw new TypeError('Position of Role must be a string.')
		//oermissions

		return this.rest
			.request('POST', Endpoints.ROLES(guildId), { body: roleData })
			.then((raw) => new Role(raw, this))
	}

	debug(
		msg: string,
		service: 'Rest Manager' | 'Client' | 'Websocket Manager' = 'Client'
	) {
		return this.emit(Events.DEBUG, `[Ferris-Lib => ${service}] ${msg}`)
	}

	deleteChannel(channelId: SnowFlake): Promise<any> {
		return this.rest.request('DELETE', Endpoints.CHANNEL(channelId))
	}

	deleteGuild(guildId: SnowFlake): Promise<any> {
		return this.rest.request('DELETE', Endpoints.GUILD(guildId))
	}

	deleteMessage(messageId: SnowFlake): Promise<any> {
		return this.rest.request('DELETE', Endpoints.MESSAGE(messageId))
	}

	deleteRole(guildId: SnowFlake, roleId: SnowFlake): Promise<any> {
		return this.rest.request('DELETE', Endpoints.ROLE(guildId, roleId))
	}

	editChannel(
		channelId: SnowFlake,
		channelData: ChannelEditOptions
	): Promise<Channel> {
		if (!channelData) throw new Error('Missing Edit data')
		else if (channelData.name && typeof channelData.name != 'string')
			throw new TypeError('Channel name must be a string.')
		return this.rest
			.request('PATCH', Endpoints.CHANNEL(channelId), {
				body: channelData,
			})
			.then((raw) => new Channel(raw, this))
	}

	editGuild(guildId: SnowFlake, guildData: GuildEditOptions): Promise<Guild> {
		if (!guildData) throw new Error('Missing Edit data')
		else if (guildData.name && typeof guildData.name != 'string')
			throw new TypeError('Guild name must be a string.')
		return this.rest
			.request('PATCH', Endpoints.GUILD(guildId), { body: guildData })
			.then((raw) => new Guild(raw, this))
	}

	editRole(
		guildId: SnowFlake,
		roleId: SnowFlake,
		roleData: RoleEditOptions
	): Promise<Role> {
		if (roleData.name && typeof roleData.name != 'string')
			throw new TypeError('Name of Role must be a string.')
		else if (roleData.color && typeof roleData.color != 'number')
			throw new TypeError('Color of Role must be a number.')
		else if (roleData.position && typeof roleData.position != 'number')
			throw new TypeError('Position of Role must be a string.')
		//oermissions
		return this.rest
			.request('PATCH', Endpoints.ROLE(guildId, roleId), {
				body: roleData,
			})
			.then((raw) => new Role(raw, this))
	}

	fetchChannel(
		channelId: SnowFlake,
		cache: boolean = true
	): Promise<Channel> {
		return this.rest
			.request('GET', Endpoints.CHANNEL(channelId))
			.then((raw) => {
				if (this.channels.has(channelId))
					return this.channels.get(channelId)._patch(raw)
				const ch = new Channel(raw, this)
				if (cache) this.channels.set(ch.id, ch)
				return ch
			})
	}

	/**
	 * Fetch a Guild from the Api
	 * @param {SnowFlake} guildId The Id for the Guild to fetch
	 * @returns {Promise<Guild>}
	 */
	public fetchGuild(
		guildId: SnowFlake,
		{
			fetchMembers = false,
			fetchChannels = true,
		}: { fetchMembers?: boolean; fetchChannels?: boolean } = {}
	): Promise<Guild> {
		const params = { members: fetchMembers, channels: fetchChannels }
		return this.rest
			.request('GET', Endpoints.GUILD(guildId), { params })
			.then((raw_guild) => {
				if (this.guilds.has(raw_guild.id_string))
					return this.guilds
						.get(raw_guild.id_string)
						._patch(raw_guild)
				const guild = new Guild(raw_guild, this)
				this.guilds.set(guild.id, guild)
				return guild
			})
	}

	fetchGuildInvites(guildId): Promise<StorageBox<string, Invite>> {
		return this.rest
			.request('GET', Endpoints.INVITES(guildId))
			.then((raw_ins) => {
				const invs: StorageBox<string, Invite> = new StorageBox()
				raw_ins.forEach((inv) =>
					invs.set(inv.code, new Invite(inv, this))
				)
				return invs
			})
	}

	fetchInvite(code: string): Promise<Invite> {
		return this.rest
			.request('GET', Endpoints.INVITE(code))
			.then((inv) => new Invite(inv, this))
	}

	fetchMessage(messageId: SnowFlake): Promise<Message> {
		return this.rest
			.request('GET', Endpoints.MESSAGE(messageId))
			.then((raw) => {
				if (this.messages.has(raw.id_string))
					return this.messages.get(raw.id_string)._patch(raw)
				const m = new Message(raw, this)
				this.messages.set(m.id, m)
				return m
			})
	}

	fetchRole(guildId: SnowFlake, roleId: SnowFlake): Promise<Role> {
		return this.rest
			.request('GET', Endpoints.ROLE(guildId, roleId))
			.then((raw) => {
				if (
					this.guilds.has(guildId) &&
					this.guilds.get(guildId).roles.has(roleId)
				)
					return this.guilds
						.get(guildId)
						.roles.get(roleId)
						._patch(raw)
				const r = new Role(raw, this)
				if (this.guilds.has(guildId))
					this.guilds.get(guildId).roles.set(r.id, r)
				return r
			})
	}

	/**
	 * Fetche a user from the api
	 * @param {SnowFlake} id The id of the user
	 * @param {{ cache: boolean; force: boolean }} options Whether to cache the user upon fetch or Force a request even if the user is in the cache
	 * @returns {User|Promise<User>}
	 */
	public fetchUser(
		id: SnowFlake,
		cache: boolean = true
	): User | Promise<User> {
		return this.rest.request('GET', Endpoints.USER(id)).then((raw_user) => {
			if (cache && this.users.has(id))
				return this.users.get(id)._update(raw_user)
			const fetchUser = new User(raw_user, this)
			if (cache && !this.users.has(id)) this.users.set(id, fetchUser)
			return fetchUser
		})
	}

	private getAccountToken(data: ConnectOptions) {
		return this.rest
			.request('POST', Endpoints.AUTH_USER(), {
				headers: { Email: data.email, Password: data.password },
			})
			.then((data) => data.token)
	}

	getWsInfo(): Promise<any> {
		return this.rest.request('GET', Endpoints.WS_INFO())
	}

	public async login(data: ConnectType): Promise<void> {
		if (!data) throw new FerrisError('AUTH_MISSING')
		if (typeof data === 'string') {
			this._token = data
		} else {
			if (!data.email) throw new FerrisError('MISSING_EMAIL')
			else if (typeof data.email != 'string')
				throw new FerrisError('EMAIL_MUST_BE_A_STRING')
			else if (!data.password) throw new FerrisError('MISSING_PASSWORD')
			else if (typeof data.password != 'string')
				throw new FerrisError('PASSWORD_MUST_BE_A_STRING')
			process.emitWarning('Email and Password Login.', {
				code: 'Auth',
				detail: 'Using an Email and Password to login resets you Account Token everytime a request is made to the Login Route',
			})
			this.debug('Fetching Account Token...')
			this._token = await this.getAccountToken(data)
		}

		if (typeof this._token != 'string')
			throw new FerrisError('TOKEN_MUST_BE_STRING')
		this.debug(
			`Provided token: ${this._token
				.split('.')
				.map((val, i) => (i > 1 ? val.replace(/./g, '*') : val))
				.join('.')}`
		)
		this.ws.start()
	}

	removeRole(
		guildId: SnowFlake,
		memberId: SnowFlake,
		roleId: SnowFlake
	): Promise<any> {
		return this.rest.request(
			'DELETE',
			Endpoints.MEMBER_ROLES(guildId, memberId, roleId)
		)
	}

	/**
	 * Use an Invite to Join a Guild
	 * @param code
	 * @returns {Promise<unknown>}
	 */
	useInvite(code: string): Promise<unknown> {
		return this.rest.request('POST', Endpoints.INVITE(code))
	}

	/**
	 * @private
	 */
	private validateOptions() {
		if (
			typeof this.options.rest.retryLimit != 'number' ||
			isNaN(this.options.rest.retryLimit)
		) {
			throw new TypeError('The Rest Retry Limit must be a number.')
		}
		if (
			typeof this.options.rest.requestTimeout != 'number' ||
			isNaN(this.options.rest.requestTimeout)
		) {
			throw new TypeError('The Request Timeout must be a number.')
		}
		if (typeof this.options.rest.headers != 'object') {
			throw new TypeError('The Rest Headers must be an object.')
		}
	}
}

import EventEmitter from 'events'
import {
	ClientEvents,
	ClientOptions,
	ConnectOptions,
	ConnectType,
	createChannelOptions,
	createGuildOptions,
	Endpoints,
	MessageData,
	SnowFlake,
	Events,
} from './Constants'
import { FerrisError } from './errors/FerrislibError'
import { WebsocketManager } from './gateway/WebsocketManager'
import { Message } from './models'
import { Guild } from './models/Guild'
import { User } from './models/User'
import { Channel } from './models/Channel'
import { RequestHandler } from './rest/RequestHandler'
import { StorageBox } from './util/StorageBox'
import { Invite } from './models/Invite'

/**
 * Main class for interacting with Api and Gateway
 * @param {ClientOptions} clientOptions The options for the client
 * @extends EventEmitter
 */
export class Client extends EventEmitter {
	public channels: StorageBox<SnowFlake, Channel>

	public messages: StorageBox<SnowFlake, Message>

	public user: User

	/**
	 * A cache that holds all the Users that have been cached by the client
	 * @type {StorageBox<SnowFlake, User>}
	 */
	public users: StorageBox<SnowFlake, User>

	/**
	 * The Handler {@link RequestHandler} used for interacting with the api
	 * @type {RequestHandler}
	 */
	public requestHandler: RequestHandler

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
					guilds: false,
					users: false,
				},
			},
			clientOptions
		)

		this.validateOptions()

		this.requestHandler = new RequestHandler(this)

		this.ws = new WebsocketManager(this)

		this.users = new StorageBox()

		this.channels = new StorageBox()

		this.messages = new StorageBox()

		this.users = new StorageBox()
	}

	/**
	 * @deprecated
	 */
	public connect() {
		return process.emitWarning("Method 'connect' is no longer usable", {
			code: 'Decaprecated Method',
			detail: "The method 'connect' has been replaced with the new method called 'login'",
		})
	}

	createChannel(
		guildId: SnowFlake,
		channelData: createChannelOptions
	): Promise<Channel> {
		if (!channelData.name)
			throw new Error('A name must be provided for Guild Creation.')
		else if (typeof channelData.name != 'string')
			throw new TypeError('Name of Guild must be a string')

		return this.requestHandler
			.request('POST', Endpoints.CHANNELS(guildId), channelData)
			.then((raw_channel) => {
				const channel = new Channel(raw_channel, this)
				this.channels.set(channel.id, channel)
				return channel
			})
	}

	createGuild(guildData: createGuildOptions): Promise<Guild> {
		if (!guildData.name)
			throw new Error('A name must be provided for Guild Creation.')
		else if (typeof guildData.name != 'string')
			throw new TypeError('Name of Guild must be a string')

		return this.requestHandler
			.request('POST', Endpoints.GUILDS(), guildData)
			.then((raw_guild) => {
				const guild = new Guild(raw_guild, this)
				this.guilds.set(guild.id, guild)
				return guild
			})
	}

	createInvite(
		guildId: SnowFlake,
		maxAge: number,
		maxUses: number
	): Promise<Invite> {
		return this.requestHandler
			.request('POST', Endpoints.INVITES(guildId), {
				max_age: maxAge,
				max_uses: maxUses,
			})
			.then((raw_inv) => {
				return new Invite(raw_inv, this)
			})
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

		return this.requestHandler
			.request(
				'POST',
				Endpoints.MESSAGES(guildId, channelId),
				messageData
			)
			.then((raw_message) => {
				const message = new Message(raw_message, this)
				this.messages.set(message.id, message)
				return message
			})
	}

	deleteChannel(channelId: SnowFlake): Promise<any> {
		return this.requestHandler
			.request('DELETE', Endpoints.CHANNEL(channelId))
			.then(() => {
				if (this.channels.has(channelId))
					this.channels.delete(channelId)
			})
	}

	deleteGuild(guildId: SnowFlake): Promise<any> {
		return this.requestHandler
			.request('DELETE', Endpoints.GUILD(guildId))
			.then(() => {
				if (this.guilds.has(guildId)) this.guilds.delete(guildId)
			})
	}

	deleteMessage(messageId: SnowFlake): Promise<any> {
		return this.requestHandler
			.request('DELETE', Endpoints.MESSAGE(messageId))
			.then(() => {
				if (this.messages.has(messageId))
					this.messages.delete(messageId)
			})
	}

	debug(
		msg: string,
		service: 'Request Handler' | 'Client' | 'Websocket Manager' = 'Client'
	) {
		return this.emit(Events.DEBUG, `[Ferris-Lib => ${service}] ${msg}`)
	}

	fetchChannel(
		channelId: SnowFlake,
		options?: { cache?: boolean; force?: boolean }
	): Promise<Channel> | Channel {
		// no channel cache yet
		return this.requestHandler.request('GET', Endpoints.CHANNEL(channelId))
	}

	/**
	 * Fetch a Guild from the Api
	 * @param {SnowFlake} guildId The Id for the Guild to fetch
	 * @returns {Promise<Guild>}
	 */
	public fetchGuild(guildId: SnowFlake): Promise<Guild> {
		return this.requestHandler
			.request('GET', Endpoints.GUILD(guildId) + '?members=true')
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
		return this.requestHandler
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
		return this.requestHandler
			.request('GET', Endpoints.INVITE(code))
			.then((inv) => new Invite(inv, this))
	}

	fetchMessage(messageId: SnowFlake): Promise<Message> {
		return this.requestHandler.request('GET', Endpoints.MESSAGE(messageId))
	}

	/**
	 * Fetche a user from the api
	 * @param {SnowFlake} id The id of the user
	 * @param {{ cache: boolean; force: boolean }} options Whether to cache the user upon fetch or Force a request even if the user is in the cache
	 * @returns {User|Promise<User>}
	 */
	public fetchUser(
		id: SnowFlake,
		options: { cache?: boolean; force?: boolean } = {
			cache: false,
			force: false,
		}
	): User | Promise<User> {
		if (!options.force && this.users.has(id)) return this.users.get(id)
		return this.requestHandler
			.request('GET', Endpoints.USER(id))
			.then((raw_user) => {
				if (options.cache && this.users.has(id))
					return this.users.get(id)._update(raw_user)
				const fetchUser = new User(raw_user, this)
				if (options.cache && !this.users.has(id))
					this.users.set(id, fetchUser)
				return fetchUser
			})
	}

	private getAccountToken(data: ConnectOptions) {
		return this.requestHandler
			.request('POST', Endpoints.AUTH_USER(), null, data, true)
			.then((data) => {
				return data.token
			})
	}

	getWsInfo(): Promise<any> {
		return this.requestHandler.request('GET', Endpoints.WS_INFO())
	}

	get guilds(): StorageBox<SnowFlake, Guild> {
		return this.user.guilds
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

	/**
	 * Use an Invite to Join a Guild
	 * @param code
	 * @returns {Promise<unknown>}
	 */
	useInvite(code: string): Promise<unknown> {
		return this.requestHandler.request('POST', Endpoints.INVITE(code))
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

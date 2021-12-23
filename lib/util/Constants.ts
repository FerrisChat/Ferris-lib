import { Guild, User, Channel, Message, Member, Role } from '../models'
import { OldChannel } from '../models/Channel'
import { OldMessage } from '../models/Message'

/**
 * Model cache Options for the Client Model Caches
 */
export interface ModelCacheOptions<T> {
	/**
	 * What is the max amount of items this cache will hold
	 */
	limit?: number
	/**
	 * A number in milliseconds that you would like the cache to be cleared.
	 */
	sweepInterval?: number
	/**
	 * A function that allows you to choose what should be filtered
	 * If not specified the collection will be cleared
	 */
	sweepFilter?: (model: T) => boolean
}

export interface ConnectOptions {
	email: string
	password: string
}

export type ConnectType = string | ConnectOptions

export interface ChannelCreateOptions {
	name: string
}

export interface UserEditOptions {
	username?: string
	email?: string
	password?: string
	avatar?: string
}

export interface GuildCreateOptions {
	name: string
}

export interface RoleCreateOptions {
	name?: string
	color?: number
	position?: number
	permissions?: unknown
}

export interface MessageData {
	content: string
}

export enum Events {
	DEBUG = 'debug',
	READY = 'ready',
	RAW_WS = 'rawWs',
	RAW_REST = 'rawRest',
	MESSAGE_CREATE = 'messageCreate',
	MESSAGE_DELETE = 'messageDelete',
	MESSAGE_UPDATE = 'messageUpdate',
	CHANNEL_CREATE = 'channelCreate',
	CHANNEL_DELETE = 'channelDelete',
	CHANNEL_UPDATE = 'channelUpdate',
	GUILD_CREATE = "guildCreate",
}

export interface ClientEvents {
	channelCreate: (channel: Channel) => void
	channelDelete: (channel: Channel) => void
	channelUpdate: (oldChannel: OldChannel, newChannel: Channel) => void
	debug: (message: string) => void
	guildCreate: (guild: Guild) => void
	messageCreate: (message: Message) => void
	messageDelete: (message: Message) => void
	messageUpdate: (oldMessage: OldMessage, newMessage: Message) => void
	rawRest: (data: any) => void
	rawWs: (data: WebSocketPayload) => void
	ready: () => void
}

/**
 * Options for the Client
 */
export interface ClientOptions {
	/**
	 * Options for the RequestHandler
	 */
	rest?: {
		/**
		 * How long should the Handler wait before Aborting a request (in seconds)
		 */
		requestTimeout?: number
		/**
		 * How many times should the client retry a Request
		 */
		retryLimit?: number
		/**
		 * How long should the RequestHandler wait before Retry the Request (in seconds)
		 */
		retryAfter?: number
		/**
		 * Additional Headers you would like passed to the client
		 */
		headers?: Record<string, string>
	}
	/**
	 * Options for each cache
	 */
	cache?: {
		/**
		 * Wether you want guilds cached or Select specific Options for the Cache
		 */
		guilds?: ModelCacheOptions<Guild> | boolean

		channels?: ModelCacheOptions<Channel> | boolean

		members?: ModelCacheOptions<Member> | boolean

		messages?: ModelCacheOptions<Message> | boolean

		/**
		 * Wether you want Users cached or Select specific Options for the Cache
		 */
		users?: ModelCacheOptions<User> | boolean

		roles?: ModelCacheOptions<Role> | boolean
	}
}

export const DefaulClientOptions: ClientOptions = {
	rest: {
		requestTimeout: 7,
		retryAfter: 5,
		retryLimit: 5,
		headers: {},
	},
	cache: {
		channels: true,
		guilds: true,
		members: true,
		messages: true,
		roles: true,
		users: true,
	},
}

/**
 * Urls for the RequestHandler (Websocket Manager Soon)
 */
export enum Urls {
	Client = 'https://ferris.chat',
	Api = 'https://api.ferris.chat',
	Base_Api = '/v',
}

/**
 * The version of FerrisChat's Api
 */
export const API_VERSION = 0

/**
 * A list of functions that return Urls that can be used to interact with the api
 */
export class Endpoints {
	//Note not all Endpoints work, some are planned others are not deployed to the api yet

	//Guilds
	static GUILD = (guildId) => `/guilds/${guildId}`
	static GUILDS = () => `/guilds`

	//Channels
	static CHANNEL = (channelId) => `/channels/${channelId}`
	static CHANNELS = (guildId) => `/guilds/${guildId}/channels`

	//Messages
	static MESSAGE = (channelId, messageId) =>
		`/channels/${channelId}/messages/${messageId}`
	static MESSAGES = (channelId) => `/channels/${channelId}/messages`

	//Members
	static MEMBER = (guildId, memberId) =>
		`/guilds/${guildId}/members/${memberId}`
	static MEMBERS = (guildId) => `/guilds/${guildId}/members` //SUBJECT TO CHANGE

	//Users
	static USER = (userId) => `/users/${userId}`
	static USER_ME = () => `/users/me`
	static USER_GUILDS = (userId) => `/users/${userId}/guilds`
	static USERS = () => `/users`

	//Invites
	static INVITES = (guildId) => `/guilds/${guildId}/invites`
	static INVITE = (code) => `/invites/${code}`

	//Auth
	static AUTH_USER = () => `/auth`
	static AUTH_BOT = (botId) => `/users/me/bots/${botId}/auth`
	static USER_BOT = (botId) => `/users/me/bots/${botId}`
	static USER_BOTS = () => `/users/me/bots`
	static BOT = (botId, guildId) => `/bots/${botId}/add/${guildId}`

	//Roles
	static ROLES = (guildId) => `/guilds/${guildId}/roles`
	static ROLE = (guildId, roleId) => `/guilds/${guildId}/roles/${roleId}`
	static MEMBER_ROLES = (guildId, memberId, roleId) =>
		`/guilds/${guildId}/members/${memberId}/role/${roleId}`

	//websockets
	static WS_INFO = () => `/ws/info`
}

export interface ChannelEditOptions {
	name: string
}

export interface GuildEditOptions {
	name: string
}

export interface MessageEditOptions {
	content: string
	nonce?: string
}

export interface RoleEditOptions {
	name?: string
	color?: number
	position?: number
	permissions?: unknown
}

export interface FetchChannelMessagesOptions {
	limit?: number
	oldestFirst?: boolean
	offset?: number
}

/**
 * Methods for the Request Handler Param "Method"
 * @type {string}
 */
export type RequestMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * For ids
 * @type {string}
 */
export type SnowFlake = string

export enum GuildFlags {
	VERIFIED_GUILD = 1 << 0,
	VERIFIED_SCAM = 1 << 2,
}

export enum UserFlags {
	/**
	 * The account is a bot
	 */
	BOT_ACCOUNT = 1 << 0,
	/**
	 * This account is a verified scam.
	 * Verified is both verified by staff, and reported by a large amount of people.
	 */
	VERIFIED_SCAM = 1 << 1,
	/**
	 * This account could possibly be a scam, as many users have reported it as such.
	 */
	POSSIBLE_SCAM = 1 << 2,
	/**
	 * This account has had either its email address or token changed within the past 24 hours.
	 * It may not be controlled by its real owner, so take precautions when using mod actions against them.
	 */
	COMPROMISED = 1 << 3,
	/**
	 * This account is a system account.
	 */
	SYSTEM = 1 << 4,
	/**
	 * This bot was one of the first 100 bots created on the platform.
	 */
	EARLY_BOT = 1 << 5,
	/**
	 *  This account is the owner of one of the first 100 bots created on the platform.
	 */
	EARLY_BOT_DEV = 1 << 6,
	/**
	 * This account was one of the first 1,000 created on the platform.
	 */
	EARLY_SUPPORTER = 1 << 7,
	/**
	 * This account is owned by someone who has donated to help keep the platform running, and support development.
	 */
	DONATOR = 1 << 8,
	/**
	 * This account is owned by a maintainer of a API wrapper for the FerrisChat API in a language.
	 */
	LIBRARY_DEV = 1 << 9,
	/**
	 *  This account is owned by someone who has contributed to FerrisChat's codebase in some way.
	 */
	CONTRIBUTOR = 1 << 10,
	/**
	 * This account is owned by a core developer/maintainer of FerrisChat itself.
	 */
	MAINTAINER = 1 << 11,
	/**
	 * This account won a Christmas event
	 */
	CHRISTMAS_EVENT_WINNER = 1 << 12,
}

export enum WebSocketCloseCodes {
	ABNORMAL_CLOSURE = 1006,
}

export enum WebSocketEvents {
	IDENTIFY_ACCEPTED = 'IdentifyAccepted',
	MESSAGE_CREATE = 'MessageCreate',
	MESSAGE_UPDATE = 'MessageUpdate',
	MESSAGE_DELETE = 'MessageDelete',
	CHANNEL_CREATE = 'ChannelCreate',
	CHANNEL_UPDATE = 'ChannelUpdate',
	CHANNEL_DELETE = 'ChannelDelete',
	GUILD_CREATE = 'GuildCreate',
	GUILD_UPDATE = 'GuildUpdate',
	GUILD_DELETE = 'GuildDelete',
	MEMBER_CREATE = 'MemberCreate',
	MEMBER_UPDATE = 'MemberUpdate',
	MEMBER_DELETE = 'MemberDelete',
	INVITE_CREATE = 'InviteCreate',
	INVITE_DELETE = 'InviteDelete',
	ROLE_CREATE = 'RoleCreate',
	ROLE_UPDATE = 'RoleUpdate',
	ROLE_DELETE = 'RoleDelete',
	MEMBER_ROLE_ADD = 'MemberRoleAdd',
	MEMBER_ROLE_DELETE = 'MemberRoleDelete',
}

export interface WebSocketPayload {
	c: string
	d: any
}

export class WebsocketPayloads {
	static Identify = (token: string) => {
		return {
			c: 'Identify',
			d: {
				token,
				intents: 69,
			},
		}
	}
}

export enum WebSocketStatus {
	IDLE = 0,
	CONNECTING = 1,
	RECONNECTING = 2,
	DISCONNECTED = 3,
	CONNECTED = 4,
	IDENTIFYING = 5,
}

export const FERRIS_EPOCH = 1_577_836_800_000

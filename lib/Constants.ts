import { Guild, User, Channel, Message, Member } from './models'

/**
 * Base Options for the Client Caches
 */
export interface BaseCacheOptions {
	/**
	 * What is the max amount of items this cache will hold
	 */
	limit?: number
	/**
	 * A number in milliseconds that you would like the cache to be cleared.
	 */
	sweepInterval?: number
}

export interface ConnectOptions {
	email: string
	password: string
	user: boolean
}

export type ConnectType = string | ConnectOptions

export interface CreateChannelOptions {
	name: string
}

export interface CreateGuildOptions {
	name: string
}

export interface CreateRoleOptions {
	name?: string;
	color?: number;
	position?: number;
	permissions?: unknown;
}

export interface MessageData {
	content: string
}

export interface ChannelCacheOptions extends BaseCacheOptions {
	/**
	 * The filter that will remove items if they dont meet the condition
	 */
	sweepFilter?: (guild: Guild) => boolean
}

export enum Events {
	DEBUG = 'debug',
	READY = 'ready',
	RAW_WS = 'rawWs',
	RAW_REST = "rawRest",
}

/**
 * The cache options for the Guild cache
 */
export interface GuildCacheOpiions extends BaseCacheOptions {
	/**
	 * The filter that will remove items if they dont meet the condition
	 */
	sweepFilter?: (guild: Guild) => boolean
}

export interface MemberCacheOptions extends BaseCacheOptions {
	/**
	 * The filter that will remove items if they dont meet the condition
	 */
	sweepFilter?: (guild: Guild) => boolean
}

export interface MessageCacheOptions extends BaseCacheOptions {
	/**
	 * The filter that will remove items if they dont meet the condition
	 */
	sweepFilter?: (guild: Guild) => boolean
}

export interface UserCacheOptions extends BaseCacheOptions {
	/**
	 * The filter that will remove items if they dont meet the condition
	 */
	sweepFilter?: (user: User) => boolean
}

export interface ClientEvents<T> {
	(event: 'debug' | 'warn', listener: (message: string) => void): T;
	(event: 'ready', listener: () => void): T;
	(event: 'rawWs', listener: (data: any) => void): T;
	(event: "rawRest", listener: (data: any) => void): T;
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
		 * Ho wmany times should the client retry a Request
		 */
		retryLimit?: number
		/**
		 * How long should the RequestHandler wait before Retry the Request (in seconds)
		 */
		retryAfter?: number
		/**
		 * Additional Headers you would like passed to the client
		 */
		headers?: Record<string, string>;
	}
	/**
	 * Options for each cache
	 */
	cache?: {
		/**
		 * Wether you want guilds cached or Select specific Options for the Cache
		 */
		guilds?: GuildCacheOpiions | boolean

		channels?: ChannelCacheOptions | boolean

		members?: MemberCacheOptions | boolean

		messages?: MessageCacheOptions | boolean

		/**
		 * Wether you want Users cached or Select specific Options for the Cache
		 */
		users?: UserCacheOptions | boolean
	}
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
	static MESSAGE = (messageId) => `/messages/${messageId}`
	static MESSAGES = (guildId, channelId) =>
		`/guilds/${guildId}/channels/${channelId}/messages`

	//Members
	static MEMBER = (guildId, memberId) =>
		`/guilds/${guildId}/members/${memberId}`
	static MEMBERS = (guildId) => `/guilds/${guildId}/members` //SUBJECT TO CHANGE

	//Users
	static USER = (userId) => `/users/${userId}`
	static USER_GUILDS = (userId) => `/users/${userId}/guilds`
	static USERS = () => `/users`

	//Invites
	static INVITES = (guildId) => `/guilds/${guildId}/invites`
	static INVITE = (code) => `/invites/${code}`

	//Auth
	static AUTH_USER = () => `/auth`
	static AUTH_BOT = (ownerId, botId) => `/users/${ownerId}/bots/${botId}/auth`

	//Roles
	static ROLES = (guildId) => `/guilds/${guildId}/roles`
	static ROLE = (guildId, roleId) => `/guilds/${guildId}/roles/${roleId}`
	static MEMBER_ROLES = (guildId, memberId, roleId) =>
		`/guilds/${guildId}/members/${memberId}/role/${roleId}`

	//websockets
	static WS_INFO = () => `/ws/info`
}

export interface EditGuildOptions {
	name: string;
}

export interface EditRoleOptions {
	name?: string;
	color?: number;
	position?: number;
	permissions?: unknown;
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

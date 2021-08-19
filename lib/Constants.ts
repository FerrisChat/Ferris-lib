/**
 * Options for the Client
 */
export interface ClientOptions {
    token: string;
    rest?: {
        requestTimeout?: number;
        retryLimit?: number;
        retryAfter?: number;
        headers?: object;
    }
}

/**
 * Urls for the RequestHandler (Websocket Manager Soon)
 */
export enum Urls {
    Client = "https://ferris.chat",
    Api = "https://api.ferris.chat",
    Base_Api = "/api/v"
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
    static CHANNEL = (guildId, channelId) => `/guilds/${guildId}/channels/${channelId}`
    static CHANNELS = (guildId) => `/guilds/${guildId}/channels`

    //Messages
    static MESSAGE = (guildId, channelId, messageId) => `/guilds/${guildId}/channels/${channelId}/messages/${messageId}`
    static MESSAGES = (guildId, channelId) => `/guilds/${guildId}/channels/${channelId}/messages`

    //Members
    static MEMBER = (guildId, memberId) => `/guilds/${guildId}/members/${memberId}`
    static MEMBERS = (guildId) => `/guilds/${guildId}/members` //SUBJECT TO CHANGE

    //Users
    static USER = (userId) => `/users/${userId}`
    static USER_GUILDS = (userId) => `/users/${userId}/guilds`
    static USERS = () => `/users`

    //Auth
    static AUTH_USER = (userId) => `/auth/${userId}`

}

/**
 * Methods for the Request Handler Param "Method"
 */
export type RequestMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
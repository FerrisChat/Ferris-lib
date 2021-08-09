export enum Urls {
    Client = "https://ferris.chat",
    Api = "https://api.ferris.chat",
    Base_Api = "/api/v"
}

export const API_VERSION = 0

export class Endpoints {
    static GUILD = (guildId) => `/guilds/${guildId}`
    static USER = (userId) => `/users/${userId}`
    static CHANNEL = (channelId) => `/channels/${channelId}`

    //Auth Flow
    static AUTH = (userId) => `/auth/${userId}`
}

export type RequestMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export const API_VERSION = 0
export const BASE_API_URL = "https://api.ferris.chat/api"
export const API_URL = `${BASE_API_URL}/v${API_VERSION}`

export class Endpoints {
    static GUILD = (guildId) => `/guilds/${guildId}`
    static USER = (userId) => `/users/${userId}`
    static CHANNEL = (channelId) => `/channels/${channelId}`

    //Auth Flow
    static AUTH = (userId) => `/auth/${userId}`
}
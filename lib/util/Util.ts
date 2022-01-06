import { Client } from '../Client'
import { Message, Channel, Guild } from '../models'

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)
export class Util {
	/**
	 * Sets default properties on an object that aren't already specified.
	 * @param {Object} def Default properties
	 * @param {Object} given Object to assign defaults to
	 * @returns {Object}
	 * @private
	 */
	static mergeDefault<T>(def: any, given: T): T {
		if (!given) return def
		for (const key in def) {
			if (!has(given, key) || given[key] === undefined) {
				given[key] = def[key]
			} else if (given[key] === Object(given[key])) {
				given[key] = this.mergeDefault(def[key], given[key])
			}
		}
		return given
	}

	static resolveGuild(data: any, client: Client, create: boolean = true): Guild {
		return (
			client.guilds.get(data.id_string) ?? create === true ?
			new Guild(data, client) : null
		)
	}

	static resolveChannel(data: any, client: Client): Channel {
		// this will change once dm channels exists
		return (
			client.channels.get(data.id_string) ??
			client.guilds
				.get(data.guild_id_string)
				?.channels.get(data.id_string) ??
			new Channel(data, client)
		)
	}

	/**
	 * Retrieves a {@link Message} from the internal cache. If no message is found, a new {@link Message} is constructed.
	 * @param {Client} client
	 * @param {object} data The message data
	 * @returns {Message} The reolves message
	 */
	static resolveMessage(data: any, client: Client): Message {
		return (
			client.messages.get(data.id_string) ??
			client.channels
				.get(data.channel_id_string)
				?.messages.get(data.id_string) ??
			new Message(data, client)
		)
	}
}

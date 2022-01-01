import { Client } from '../lib'
const client = new Client({
	rest: {
		requestTimeout: 45,
	},
})

client.on('debug', console.log)
client.on('rawWs', (payload) => console.log('RAW WS', payload))
client.on('rawRest', (payload) => console.log('RAW REST', payload))
client.on('ready', () => {
	console.log('Client is Ready')
	//test()
})

client.on('messageCreate', async (message) => {
	console.log(message)
	switch (message.content) {
		case 'tsping':
			message.channel.createMessage({
				content: `Pong, Gateway Ping: \`${client.ws.latency}ms\` and Rest Ping: \`${client.rest.latency}ms\``,
			})
			break
		case 'tsedit':
			message.channel
				.createMessage({
					content: 'Hi',
				})
				.then((m) => m.edit('Test Edit works'))
			break
		case 'tsch':
			const tschm = await message.channel.createMessage({
				content: 'Creating Channel',
			})
			const tsch = await message.channel.guild.createChannel({
				name: 'Ts-God',
			})
			await tschm.edit('Done, Deleting...')
			await tsch.delete()
			tschm.edit('Done.')
			break
		case 'tsche':
			if (!message.channel.name.startsWith('Ts'))
				return message.channel.createMessage({
					content: 'Not Allowed to edit this channel',
				})
			await message.channel.edit({ name: 'Ts-edited' })
			message.channel.createMessage({ content: 'Done.' })
			break
		case 'tschd':
			if (!message.channel.name.startsWith('Ts'))
				return message.channel.createMessage({
					content: 'Not Allowed to delete this channel',
				})
			await message.channel.delete()
			break
		case 'tshelp':
			message.channel.createMessage({
				content:
					"Commands:\n\n**Most commands will only work on a channel that starts with** `Ts`\n\n`tsping` = See bot's latency\n`tsedit` = Test Message Edit (have to reload client)\n`tsch` = Create A Channel (cant be seen due to client [sometimes])\n`tsche` = Edit Current channel (have to reload client)\n`tshelp` = This.is.the.help.command\n`tschd` = Delete a channel (have to reload client)",
			})
			break
		default:
			return
	}
})
client.on('messageDelete', (message) =>
	console.log(
		`Message from ${message.author.name} (${message.author.id}) deleted with content: ${message.content}`
	)
)
client.on('messageUpdate', (oldMessage, newMessage) => {
	console.log(
		`[Message Edited] OldMessage: ${oldMessage.content} | NewMessage: ${newMessage.content} | By: ${newMessage.author.name}`
	)
})
client.on('channelCreate', (channel) =>
	console.log(
		`New Channel created: Name: ${channel.name} | Guild: ${channel.guild.name}`
	)
)
client.on('channelDelete', (channel) =>
	console.log(
		`Channel: ${channel.name} was deleted | Guild: ${channel.guild.name}`
	)
)
client.on('channelUpdate', (och, nch) =>
	console.log(
		`[Channel Updated] OldChannel: ${och.name} | NewChannel: ${nch.name} | Guild: ${nch.guild.name}`
	)
)

client.on('guildCreate', (guild) =>
	console.log(
		`Joined Guild: ${guild.name} with ${guild.members.size} members`
	)
)

client.login(
	'MTE5ODQ4MTY3OTQ1Mjk5NTE1MDUzNTk4MzEwNA==.2JaWfMds_sKD32tKk-9l19uSSGyknJ_3VaRhqEDMoRER7C63rHb6waeGfMj3p8CPjWkbTZ74uiRssO2w8PzBLw=='
)

async function test() {
	const g = await client.createGuild({ name: 'Test Guild' })
	await client.fetchGuild(g.id, { fetchChannels: true, fetchMembers: true })
	const ch = await g.createChannel({ name: "Test Channel" })
	await ch.edit({ name: "Test Channel Edit" })
	const msg = await ch.createMessage({ content: "Test Message" })
	await msg.edit({ content: "Test Message Edit" })
	await msg.delete()
	await ch.delete()
	await g.delete()
	return client.ws.connection.close()
}

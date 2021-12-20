const Ferrislib = require('../build/index')
const client = new Ferrislib.Client({
	rest: { requestTimeout: 45 },
})

client.on('rawWs', (data) => console.log('RAW WS', data))
client.on('rawRest', (data) => console.log('RAW REST', data))
client.on('debug', console.log)
client.on('ready', async () => {
	console.log('Client is ready!')
})
client.on('messageCreate', (message) => {
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

client.login(
	'MTEwMjg0NjYzNzc4MDYxNzQ4OTg5ODA4NTI4NTg4OA==.P38_LjfkXwZXoilnOq-_U18XISIKQAiCITkWNhrcSu6NBbh7__eyqghuCuFj5bJL-edSPu9MW_UMXVYn6-aK-Q=='
)

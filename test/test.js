const Ferrislib = require('../build/index')
const client = new Ferrislib.Client()

client.on('rawWs', console.log)
client.on('rawRest', console.log)
client.on('debug', console.log)
client.on('ready', async () => {
	console.log('Ready')
	console.log(client)
})
client.on('messageCreate', (message) => {
	console.log(message, client.messages)
	if (message.content.toLowerCase() === 'tsping') {
		return message.channel.createMessage({
			content: `Pong, Gateway Ping: \`${client.ws.latency}ms\` and Rest Ping: \`${client.rest.latency}ms\``,
		})
	}
})
client.on('messageDelete', (message) =>
	console.log(
		`Message from ${message.author.name} (${message.author.id}) deleted with content: ${message.content}`
	)
)

client.login(
	'MTEwMjg0NjYzNzc4MDYxNzQ4OTg5ODA4NTI4NTg4OA==.P38_LjfkXwZXoilnOq-_U18XISIKQAiCITkWNhrcSu6NBbh7__eyqghuCuFj5bJL-edSPu9MW_UMXVYn6-aK-Q=='
)

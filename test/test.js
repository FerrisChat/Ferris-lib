const Ferrislib = require('../build/index')
const client = new Ferrislib.Client()

client.on('rawWs', console.log)
client.on("rawRest", console.log)
client.on('debug', console.log)
client.on('ready', async () => {
	/*await client.user.fetch()
	const g = await client.createGuild({ name: 'test' })
	console.log(g)
	const c = await client.createChannel(g.id, { name: 'test' })
	console.log(c)
	console.log(client.guilds.get(g.id))
	await client.deleteChannel(c.id)
	await client.deleteGuild(g.id)*/
	console.log(client.user, client.guilds)
	console.log('Test Complete')
})

client.login({ email: 'drxbot@notgay.com', password: 'ferrischat' })

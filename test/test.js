const Ferrislib = require('../build/index')
const token =
	'MTA1NDc4Njk1NDUzODU2MjE4NzY3ODY5NDc2ODY0MA==.BVwW6vC4gw-B6MVJGqqaaGWIw1saNFvEOH7cSLbcmJb53lv-wv4mUHKlpy_c0PiJeXbR57dqMy77iv8a5VZd1g=='
const client = new Ferrislib.Client()

client.on('rawWs', console.log)
client.on('debug', console.log)
client.on('ready', async () => {
	await client.user.fetch()
	const g = await client.createGuild({ name: "test" })
	console.log(g)
	const c = await client.createChannel(g.id, { name: "test" })
	console.log(c)
	console.log(client.guilds.get(g.id))
	await client.deleteChannel(c.id)
	await client.deleteGuild(g.id)
	console.log("Test Complete")
	client.ws.connection.terminate()
})

client.login({ email: 'dillonf559@gmail.com', password: 'ferrischat' })

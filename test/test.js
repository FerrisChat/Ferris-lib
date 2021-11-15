const Ferrislib = require('../build/index')
const token =
	'MTA1NDc4Njk1NDUzODU2MjE4NzY3ODY5NDc2ODY0MA==.BVwW6vC4gw-B6MVJGqqaaGWIw1saNFvEOH7cSLbcmJb53lv-wv4mUHKlpy_c0PiJeXbR57dqMy77iv8a5VZd1g=='
const client = new Ferrislib.Client()

client.on('rawWs', console.log)
client.on('debug', console.log)
client.on('ready', async () => {
	await client.user.fetch()
	console.log(client.guilds)
	/*const g = await client.createGuild({ name: "test" })
	console.log(g)
	const c = await client.createChannel(g.id, { name: "test" })
	console.log(c)
	console.log(client.guilds.get(g.id))
	await client.deleteChannel(c.id)
	await client.deleteGuild(g.id)*/
	await client.deleteGuild('1080739102536400723714235170816')
	await client.deleteGuild('1054786954538562187678694768640')
	await client.deleteGuild('1080756542992138477132193988608')
	await client.deleteGuild('1080758222051677563119094202368')
	await client.deleteGuild('1080760284821940126338377580544')
	console.log(client.guilds)
})

client.login({ email: '=', password: '=' })

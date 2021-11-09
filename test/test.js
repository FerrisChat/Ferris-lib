const Ferrislib = require('../build/index')
const token = "MTA1NDc4Njk1NDUzODU2MjE4NzY3ODY5NDc2ODY0MA==.BVwW6vC4gw-B6MVJGqqaaGWIw1saNFvEOH7cSLbcmJb53lv-wv4mUHKlpy_c0PiJeXbR57dqMy77iv8a5VZd1g=="
const client = new Ferrislib.Client({
    shardCount: 1,
})

client.on("rawWs", console.log)
client.on("debug", console.log)
client.on("ready", async () => {
    await client.user.fetch()
    console.log(client.guilds)
})

client.login({ email: "dillonf559@gmail.com", password: "ferrischat" })
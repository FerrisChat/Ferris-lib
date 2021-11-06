const Ferrislib = require('../build/index')
const token = "MTA1NDc4Njk1NDUzODU2MjE4NzY3ODY5NDc2ODY0MA==.BVwW6vC4gw-B6MVJGqqaaGWIw1saNFvEOH7cSLbcmJb53lv-wv4mUHKlpy_c0PiJeXbR57dqMy77iv8a5VZd1g=="
const sys = new Ferrislib.Client(token, {
    shardCount: 1,
})

/** */
async function test() {
    sys.on("debug", console.log)
    sys.on("ready", async () => {
        console.log(`${sys.user.name} has logged in`)
    })
    sys.on("shardReconnecting", (id) => console.log(`Shard ${id} is reconnecting...`))
    sys.on("shardReady", (id) => console.log(`Shard ${id} is ready`))
    sys.on("shardDisconnected", (id, code, reason) => console.log(`Shard ${id} disconnected with the Code: ${code} and reason: ${reason}`))
    sys.connect()
}
test()


setInterval(() => {
    //console.log("Memory Usage (Rss)", Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100, "MB")
    //console.log("Memory Usage (HeapUsed)", Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100, "MB")
}, 1000 * 60)
const Ferrislib = require('../build')
const token = "OTc5OTc1Mjc1MzkwMTQ3MjUxODc3NTk4OTg2MjQw.oPv_AsjrLgMwF4QD2BTWkvYGfZMopTvILZM7NVSAkvqI_dWNYlofF9RRbD_9wn4PYskwDXHhgNkPmjUpS3GlsRYeqxS3plXmWwlSqPWsLwPyvSJjrT-UD03cf3BXE0oX4eSgE9PyrQOQrypdBIIzjJoziPLC2WpwnANuPVtqkPlmSRS7nmsAJBhkStUzqOOfX9pZIoCl4knt1ppOalhYgvpZ8EmfX4Nbu31Oc331lOeOQUGJEuIo-0YHyEmBTOFqw0CIJcjaoGXfP8lO0G-vLClR_EIRLLMNEcyKYb1pWMp0FrfrzKMBTklvVRxePwRFHl0mzg7I7HCUxmRQZcM8Zw=="
const sys = new Ferrislib.Client(token, {
    shardCount: 1,
})
/** */
async function test() {
    sys.on("debug", console.log)
    sys.connect()
}
test().catch(console.warn)


setInterval(() => {
    //keep process up
}, 1000 * 10)
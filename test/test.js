const Ferrislib = require('../build')
const sys = new Ferrislib.Client({
    token: "MTMxOTQxMzk1MzMzMTI=.rqabyqIIlhHYaEeSQrvXrMyD0_P8YpiGyu1ZMzBl3M7aUlepa8jgA6nKfd_tQfWwu_ac28Yl3gp3cml6w2t1txirO_0-xhktf7ndNxSAYFZUWQYVM1j526bHcqu9xpuD28kkB6HXh3UrNjZG533YLIhkrg01TvosA8yZ60Yngn7JK0xhDNwQF4Az2CdZGL1vR1YUVi7AoOixkEMzSxJlro29CCkwIXExOKN-P5hGy8rld86Z-yKnpaxwILMIRONDVpFtUn9fj1BvKV2EvQLcg840gh5x-s9vVgzym73Ln5Y_iAm9bCOd2jiFEsgr3WsY0cSj6bi3ywKRoDRUYwK5QQ=="
})

/** */
async function test() {
    //test user: 13194139533312
    // test guild: 

    const test = await sys.requestHandler.request("POST", Ferrislib.Constants.Endpoints.GUILDS())
    console.log(test)
}
test()



/** 
async function getAuthToken() {
    const data = await sys.requestHandler.request("GET", Ferrislib.Constants.Endpoints.AUTH_USER("13194139533312"))
    console.log(data)
}
getAuthToken()
*/



/** 
async function createAccount() {
    const data = await sys.requestHandler.request("POST", Ferrislib.Constants.Endpoints.USERS(), {
        username: "name",
        password: "password",
        email: "email",
    })
    console.log(data)
}
createAccount()
*/


setInterval(() => {
    //keep process up
}, 1000 * 10)
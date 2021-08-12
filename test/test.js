const Ferrislib = require('../build')
const sys = new Ferrislib.Client({
    token: "MjgzNDcyODkzNDcy.9NiKkbutW_39gE8blHOnWHfFptL_4lcXgJ2OaBNykE5nYFdTzrAx_NNXrRnoCv74ybSyCn8slOIaoY0Kou_uWwJl6s9PqREScwZjZyspGkYJdiLGJzWean5THKN6uyFBiGrOXTW_jrFmFYQXuDJ1jbebVX3QcMpISkWHk2VcChUw9MXgMEntto_JsgjNIpsxzBwkWQNeIyMOp-aFN3i3hjmUh2kj245ePzRBE3mbdxoZ5C9vHJ-nu17Kc-EAogJPJCp-guV2i0CfKaAqIdCRMg7yCr-hNwYSmOWSGEwhauea1hQ8vN2zi7H0ReeQ98L537FWfPqu3xicjBCsYCETGw==",
})
/** 
async function test() {
    //const testguild = await sys.getGuild("8796093022208")
    //console.log(sys.guilds)
    const testuser = await sys.getUser("0", { cache: true, force: true })
    console.log(sys.users)
}
test()
*/

async function getAuthToken() {
    const data = await sys.requestHandler.request("GET", Ferrislib.Constants.Endpoints.AUTH_USER("45"))
    console.log(data)
}
getAuthToken()

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
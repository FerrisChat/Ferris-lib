const Ferrislib = require('../build')
const sys = new Ferrislib.Client({
    token: "MA==.9Yz0aEwtyKpNCqLxy6tz1z3OcQb_XbYCtnP_9kiRST9Y7uVZl9INSjo2-z9Mqffji8Raxf11INGGkD-SvzMbLbFP0eX36bJMbW_P4eVcUPF_JZcUFGOXA4PAWfhxZKEIJjpi12sH29GyhO-bU09oU09W0KXYSp3NPxGKWF9SN-DUNlLx7YeKybvfDA-EpAh_H02U0lO4R5QDz72bxKAtR2su2-yz6f78P65CgDfq6wNcxyIWCyNte1OTuGVrdBxvsXJVWia06VJingqTphdMNsmcmqRKGm0ujmdqo3WZiWD1Skb4UmF9cZW7BPG-7DUYh4l3eNZ-b7SCQ23hsRyJzA==",
})

/** */
async function test() {
    //const testguild = await sys.getGuild("8796093022208")
    //console.log(sys.guilds)
    const testuser = await sys.fetchUser("13194139533312", { cache: true, force: true })
    console.log(sys.users)
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
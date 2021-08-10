const Ferrislib = require('../build')

const http69 = new Ferrislib.RequestHandler(null)
//Test guild: 8796093022208
http69.request("GET", Ferrislib.Constants.Endpoints.GUILD("8796093022208"))
    .then((req) => {
        console.log(req)
    })
    .catch((e) => {
        console.error(e)
    })
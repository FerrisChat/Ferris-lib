const Ferrislib = require('../build')

const http69 = new Ferrislib.RequestHandler(null)
//Test user: 4398046511104
//Test guild: 8796093022208
http69.request("GET", Ferrislib.Constants.Endpoints.USER("4398046511104"))
    .then((req) => {
        console.log(req)
    })
    .catch((e) => {
        console.error(e)
    })
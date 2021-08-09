const Ferrislib = require('../build')

const http69 = new Ferrislib.RequestHandler(null)

http69.request("GET", Ferrislib.Constants.Endpoints.USER("4398046511104"))
export class FerrisError extends Error {
	code: string

	constructor(key, ...args) {
		if (Messages[key] == null)
			throw new TypeError(`Error key '${key}' does not exist`)
		const message =
			typeof Messages[key] === 'function'
				? Messages[key](...args)
				: Messages[key]

		super(message)
		this.code = key
	}

	get name() {
		return `FerrisLibError [${this.code}]`
	}
}

class Messages {
	// xyz is Missing
	static AUTH_MISSING = () =>
		`Please provide a token or email and password for the Client to login with.`
	static MISSING_EMAIL = () =>
		`Please provide an email for the Client to login with.`
	static MISSING_VALUE = () =>
		`Please provide a password for the Client to login with.`

	// xyz is invalid
	static MUST_BE_STRING = (value) => `Provided ${value} is not a String.`
	static INVALID_TOKEN = () => `The token that was provided is Invalid.`

	// websocket manager
	static WS_ALREADY_STARTED = () => `Websocket Manager has already started.`
	static GATEWAY_ERROR = (err) => `Gateway Error`
	static DATA_SENT_BEFORE_IDENTIFY = () =>
		`Data was sent tp the Gateway before Identifying`
}

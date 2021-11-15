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
	static MISSING_PASSWORD = () =>
		`Please provide a password for the Client to login with.`

	// xyz is invalid
	static TOKEN_MUST_BE_STRING = () => `Provided Token is not a String.`
	static EMAIL_MUST_BE_A_STRING = () => `Provided Email is not a String.`
	static PASSWORD_MUST_BE_A_STRING = () =>
		`Provided Password is not a String.`

	// websocket manager
	static WS_ALREADY_STARTED = () => `Websocket Manager has already started.`
}

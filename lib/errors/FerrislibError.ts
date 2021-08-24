export class FerrisError extends Error {
    code: string;

    constructor(key, ...args) {
        if (Messages[key] == null) throw new TypeError(`Error key '${key}' does not exist`);
        const message = typeof Messages[key] === 'function'
            ? Messages[key](...args)
            : Messages[key];

        super(message);
        this.code = key;
    }

    get name() {
        return `FerrisLibError [${this.code}]`;
    }
}

class Messages {
    static TOKEN_MISSING = () => `Please provide a token for the Client.`;
    static TOKEN_MUST_BE_STRING = () => `Provided Token is not a String.`
}
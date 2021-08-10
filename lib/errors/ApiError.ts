export class APIError extends Error {
    method: string;
    path: string;
    code: number;
    httpStatus: number;

    constructor(error, status, request) {
        super();
        this.name = 'APIError';

        /**
         * The HTTP method used for the request
         * @type {string}
         */
        this.method = request.method;

        /**
         * The path of the request relative to the HTTP endpoint
         * @type {string}
         */
        this.path = request.path;

        /**
         * HTTP error code returned by Discord
         * @type {number}
         */
        this.code = error.code;

        /**
         * The HTTP status code
         * @type {number}
         */
        this.httpStatus = status;
    }

}
import fetch from 'node-fetch';
import * as sse from 'fetch-sse';

/** client provides support for making raw http calls. This module is for
 * internal support for the collection of APIs. */
export module client {
    /** Error represents an error that can be returned from the API service. */
    export interface Error {
        /** error represents an error message. */
        error: string;
    }

    // -------------------------------------------------------------------------

    /** Client provides access to make raw http calls. */
    export class Client {
        private url;
        private apiKey;

        // ---------------------------------------------------------------------

        /** constructor constructs a client API for use.
         *
         * @param {string} url - url represents the transport and domain:port.
         * @param {string} apiKey - apiKey represents PG api key.
         */
        constructor(url: string, apiKey: string) {
            this.url = url;
            this.apiKey = apiKey;
        }

        // ---------------------------------------------------------------------

        /** RawDoGet performs a raw GET call.
         *
         * @param {string} endpoint - endpoint represents endpoint to call and
         * does not include the transport or domain.
         *
         * @returns - A Promise with a respose object and an error object if
         * the error is not null.
         */
        protected async RawDoGet(endpoint: string): Promise<[any, Error | null]> {
            try {
                const response = await fetch(`${this.url}/${endpoint}`, {
                    method: 'get',
                    headers: {'Content-Type': 'application/json', 'x-api-key': this.apiKey},
                });

                if (response.status != 200) {
                    switch (response.status) {
                        case 404:
                            return [null, {error: 'url not found'}];

                        case 403:
                            return [null, {error: 'api understands the request but refuses to authorize it'}];

                        case 503:
                            return [null, {error: 'service unavilable'}];

                        default:
                            const result = await response.json();
                            return [null, result as Error];
                    }
                }

                const contextType = response.headers.get('content-type');

                let result;
                switch (true) {
                    case contextType?.startsWith('text/plain'):
                        result = await response.text();
                        break;

                    case contextType?.startsWith('application/json'):
                        result = await response.json();
                        break;
                }

                return [result, null];
            } catch (e) {
                return [null, {error: JSON.stringify(e)}];
            }
        }

        /**
         *  RawDoPost performs a raw POST call.
         *
         * @param {string} endpoint - endpoint represents endpoint to call and
         * does not include the transport or domain.
         * @param {any} body - body represents an input object.
         *
         * @returns - A Promise with a respose object and an error object if
         * the error is not null.
         */
        protected async RawDoPost(endpoint: string, body: any): Promise<[any, Error | null]> {
            try {
                const response = await fetch(`${this.url}/${endpoint}`, {
                    method: 'post',
                    headers: {'Content-Type': 'application/json', 'x-api-key': this.apiKey},
                    body: JSON.stringify(body),
                });

                if (response.status != 200) {
                    switch (response.status) {
                        case 404:
                            return [null, {error: 'url not found'}];

                        case 403:
                            return [null, {error: 'api understands the request but refuses to authorize it'}];

                        case 503:
                            return [null, {error: 'service unavilable'}];

                        default:
                            const result = await response.json();
                            return [null, result as Error];
                    }
                }

                const contextType = response.headers.get('content-type');

                let result;
                switch (true) {
                    case contextType?.startsWith('text/plain'):
                        result = await response.text();
                        break;

                    case contextType?.startsWith('application/json'):
                        result = await response.json();
                        break;
                }

                return [result, null];
            } catch (e) {
                return [null, {error: JSON.stringify(e)}];
            }
        }

        /**
         *  RawDoSSEPost performs a raw POST call with SSE support.
         *
         * @param {string} endpoint - endpoint represents endpoint to call and
         * does not include the transport or domain.
         * @param {any} body - body represents an input object.
         * @param {(event: sse.ServerSentEvent | null, err: Error | null) => void} onMessage -
         * onMessage represents a function that will receive the stream of chat
         * results.
         *
         * @returns - A Promise with an error object if the error is not null.
         */
        protected async RawDoSSEPost(endpoint: string, body: any, onMessage: (event: sse.ServerSentEvent | null, err: Error | null) => void): Promise<Error | null> {
            try {
                await sse.fetchEventData(`${this.url}/${endpoint}`, {
                    method: 'POST',
                    data: body,
                    headers: {'Content-Type': 'application/json', 'x-api-key': this.apiKey},

                    onMessage: (event, done) => {
                        if (done) {
                            onMessage(null, {error: 'EOF'});
                            return;
                        }

                        if (event == null) {
                            return;
                        }

                        onMessage(event, null);
                    },

                    onOpen: async (res) => {
                        const response = res as Response;
                        if (response.status != 200) {
                            switch (response.status) {
                                case 404:
                                    onMessage(null, {error: 'url not found'});

                                case 403:
                                    onMessage(null, {error: 'api understands the request but refuses to authorize it'});

                                case 503:
                                    onMessage(null, {error: 'service unavilable'});

                                default:
                                    const result = await response.json();
                                    onMessage(null, result as Error);
                            }
                        }
                    },

                    onError: (e) => {
                        if (Object.keys(e).length === 0) {
                            onMessage(null, {error: 'EOF'});
                            return;
                        }

                        onMessage(null, {error: JSON.stringify(e)});
                    },
                });

                return null;
            } catch (e) {
                return {error: JSON.stringify(e)};
            }
        }
    }
}

export default client;

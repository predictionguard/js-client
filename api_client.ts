import fetch from 'node-fetch';

export module client {
    export interface Error {
        error: string;
    }

    // -------------------------------------------------------------------------

    export class Client {
        private url;
        private apiKey;

        // ---------------------------------------------------------------------

        constructor(url: string, apiKey: string) {
            this.url = url;
            this.apiKey = apiKey;
        }

        // ---------------------------------------------------------------------

        async RawDoGet(endpoint: string): Promise<[any, Error | null]> {
            try {
                const response = await fetch(`${this.url}/${endpoint}`, {
                    method: 'get',
                    headers: {'Content-Type': 'application/json', 'x-api-key': this.apiKey},
                });

                if (response.status != 200) {
                    switch (response.status) {
                        case 404:
                            return [null, {error: 'url not found'}];
                        case 401:
                            return [null, {error: 'api understands the request but refuses to authorize it'}];
                        default:
                            const result = await response.json();
                            return [null, result as Error];
                    }
                }

                const contextType = response.headers.get('content-type');

                var result;
                switch (true) {
                    case contextType?.startsWith('text/plain'):
                        result = await response.text();
                    case contextType?.startsWith('application/json'):
                        result = await response.json();
                }

                return [result, null];
            } catch (e) {
                return [null, {error: JSON.stringify(e)}];
            }
        }

        async RawDoPost(endpoint: string, body: any): Promise<[any, Error | null]> {
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
                        case 401:
                            return [null, {error: 'api understands the request but refuses to authorize it'}];
                        default:
                            const result = await response.json();
                            return [null, result as Error];
                    }
                }

                const contextType = response.headers.get('content-type');

                var result;
                switch (true) {
                    case contextType?.startsWith('text/plain'):
                        result = await response.text();
                    case contextType?.startsWith('application/json'):
                        result = await response.json();
                }

                return [result, null];
            } catch (e) {
                return [null, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default client;

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

        async DoGet(endpoint: string) {
            try {
                const response = await fetch(`${this.url}/${endpoint}`, {
                    method: 'get',
                    headers: {'Content-Type': 'application/json', 'x-api-key': this.apiKey},
                });
        
                if (response.status != 200) {
                    switch (response.status) {
                        case 404:
                            return [null, 'url not found'];
                        case 401:
                            return [null, 'api understands the request but refuses to authorize it'];
                        default:
                            const result = await response.json();
                            return [null, result as Promise<any>];
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
                return [null, e];
            }
        }
        
        async DoPost(endpoint: string, body: any): Promise<[any, any]> {
            try {
                const response = await fetch(`${this.url}/${endpoint}`, {
                    method: 'post',
                    headers: {'Content-Type': 'application/json', 'x-api-key': this.apiKey},
                    body: JSON.stringify(body),
                });
        
                if (response.status != 200) {
                    switch (response.status) {
                        case 404:
                            return [null, 'url not found'];
                        case 401:
                            return [null, 'api understands the request but refuses to authorize it'];
                        default:
                            const result = await response.json();
                            return [null, result as Promise<Error>];
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
        
                return [result as Promise<any>, null];
            } catch (e) {
                return [null, e];
            }
        } 
        
        // ---------------------------------------------------------------------

        async HealthCheck() {
            try {
                return this.DoGet('');
            } catch (e) {
                return [null, e];
            }
        }

        async Completions(model: string, maxTokens: number, temperature: number, prompt: string) {
            try {
                const body = {
                    model: model,
                    max_tokens: maxTokens,
                    temperature: temperature,
                    prompt: prompt,
                };

                return this.DoPost('completions', body);
            } catch (e) {
                return [null, e];
            }
        }

        async Factuality(reference: string, text: string) {
            try {
                const body = {
                    reference: reference,
                    text: text,
                };

                return this.DoPost('factuality',body);
            } catch (e) {
                return [null, e];
            }
        }

        async Injection(prompt: string) {
            try {
                const body = {
                    prompt: prompt,
                    detect: true,
                };

                return this.DoPost('injection', body);
            } catch (e) {
                return [null, e];
            }
        }

        async ReplacePI(prompt: string, replaceMethod: string) {
            try {
                const body = {
                    prompt: prompt,
                    replace: true,
                    replace_method: replaceMethod,
                };

                return this.DoPost('PII', body);
            } catch (e) {
                return [null, e];
            }
        }

        async Toxicity(text: string) {
            try {
                const body = {
                    text: text,
                };

                return this.DoPost('toxicity', body);
            } catch (e) {
                return [null, e];
            }
        }

        async Translate(text: string, sourceLang: string, targetLang: string) {
            try {
                const body = {
                    text: text,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                };

                return this.DoPost('translate', body);
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default client;

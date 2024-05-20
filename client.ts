import fetch from 'node-fetch';

export default class Client {
    private url;
    private apiKey;

    // -------------------------------------------------------------------------

    constructor(url: string, apiKey: string) {
        this.url = url;
        this.apiKey = apiKey;
    }

    // -------------------------------------------------------------------------

    async HealthCheck() {
        try {
            return doGet(`${this.url}`, this.apiKey);
        } catch (e) {
            return [null, e];
        }
    }

    async Chat(model: string, maxTokens: number, temperature: number, messages: any) {
        try {
            const body = {
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                messages: messages,
            };

            return doPost(`${this.url}/chat/completions`, this.apiKey, body);
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

            return doPost(`${this.url}/completions`, this.apiKey, body);
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

            return doPost(`${this.url}/factuality`, this.apiKey, body);
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

            return doPost(`${this.url}/injection`, this.apiKey, body);
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

            return doPost(`${this.url}/PII`, this.apiKey, body);
        } catch (e) {
            return [null, e];
        }
    }

    async Toxicity(text: string) {
        try {
            const body = {
                text: text,
            };

            return doPost(`${this.url}/toxicity`, this.apiKey, body);
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

            return doPost(`${this.url}/translate`, this.apiKey, body);
        } catch (e) {
            return [null, e];
        }
    }
}

// =============================================================================

async function doGet(url: string, apiKey: string) {
    try {
        const response = await fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json', 'x-api-key': apiKey},
        });

        if (response.status != 200) {
            switch (response.status) {
                case 404:
                    return [null, 'url not found'];
                case 401:
                    return [null, 'api understands the request but refuses to authorize it'];
                default:
                    const result = await response.json();
                    return [null, result.error];
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

async function doPost(url: string, apiKey: string, body: any) {
    try {
        const response = await fetch(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json', 'x-api-key': apiKey},
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
                    return [null, result.error];
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

import fetch from 'node-fetch';

export default class Client {
    #url;
    #apiKey;

    // -------------------------------------------------------------------------

    constructor(url, apiKey) {
        this.#url = url;
        this.#apiKey = apiKey;
    }

    // -------------------------------------------------------------------------

    async HealthCheck() {
        try {
            return doGet(`${this.#url}`, this.#apiKey);
        } catch (e) {
            return [null, e];
        }
    }

    async Chat(model, maxTokens, temperature, messages) {
        try {
            const body = {
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                messages: messages,
            };

            return doPost(`${this.#url}/chat/completions`, this.#apiKey, body);
        } catch (e) {
            return [null, e];
        }
    }

    async Completions(model, maxTokens, temperature, prompt) {
        try {
            const body = {
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                prompt: prompt,
            };

            return doPost(`${this.#url}/completions`, this.#apiKey, body);
        } catch (e) {
            return [null, parseError(e)];
        }
    }

    // async Factuality(reference, text) {
    //     try {
    //         const body = {
    //             reference: reference,
    //             text: text,
    //         };

    //         const result = await $.ajax({
    //             type: 'post',
    //             url: `${this.#url}/factuality`,
    //             headers: {'x-api-key': this.#apiKey},
    //             data: JSON.stringify(body),
    //         });

    //         return [result, null];
    //     } catch (e) {
    //         return [null, parseError(e)];
    //     }
    // }

    // async Injection(prompt, detect) {
    //     try {
    //         const body = {
    //             prompt: prompt,
    //             detect: detect,
    //         };

    //         const result = await $.ajax({
    //             type: 'post',
    //             url: `${this.#url}/factuality`,
    //             headers: {'x-api-key': this.#apiKey},
    //             data: JSON.stringify(body),
    //         });

    //         return [result, null];
    //     } catch (e) {
    //         return [null, parseError(e)];
    //     }
    // }

    // async ReplacePI(prompt, replaceMethod) {
    //     try {
    //         const body = {
    //             prompt: prompt,
    //             replace: replace,
    //             replace_method: replaceMethod,
    //         };

    //         const result = await $.ajax({
    //             type: 'post',
    //             url: `${this.#url}/PII`,
    //             headers: {'x-api-key': this.#apiKey},
    //             data: JSON.stringify(body),
    //         });

    //         return [result, null];
    //     } catch (e) {
    //         return [null, parseError(e)];
    //     }
    // }

    // async Toxicity(text) {
    //     try {
    //         const body = {
    //             text: text,
    //         };

    //         const result = await $.ajax({
    //             type: 'post',
    //             url: `${this.#url}/toxicity`,
    //             headers: {'x-api-key': this.#apiKey},
    //             data: JSON.stringify(body),
    //         });

    //         return [result, null];
    //     } catch (e) {
    //         return [null, parseError(e)];
    //     }
    // }

    // async Translate(text, sourceLang, targetLang) {
    //     try {
    //         const body = {
    //             text: text,
    //             source_lang: sourceLang,
    //             target_lang: targetLang,
    //         };

    //         const result = await $.ajax({
    //             type: 'post',
    //             url: `${this.#url}/translate`,
    //             headers: {'x-api-key': this.#apiKey},
    //             data: JSON.stringify(body),
    //         });

    //         return [result, null];
    //     } catch (e) {
    //         return [null, parseError(e)];
    //     }
    // }
}

// =============================================================================

async function doGet(url, apiKey) {
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

        if (response == null) {
            return [null, null];
        }

        const result = await response.json();

        return [result, null];
    } catch (e) {
        return [null, e];
    }
}

async function doPost(url, apiKey, body) {
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

        if (response == null) {
            return [null, null];
        }

        const result = await response.json();

        return [result, null];
    } catch (e) {
        return [null, e];
    }
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
export var client;
(function (client) {
    // -------------------------------------------------------------------------
    class Client {
        // -------------------------------------------------------------------------
        constructor(url, apiKey) {
            this.url = url;
            this.apiKey = apiKey;
        }
        // -------------------------------------------------------------------------
        HealthCheck() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return doGet(`${this.url}`, this.apiKey);
                }
                catch (e) {
                    return [null, e];
                }
            });
        }
        Chat(model, maxTokens, temperature, messages) {
            return __awaiter(this, void 0, void 0, function* () {
                const zeroChat = {
                    id: "",
                    object: "",
                    created: 0,
                    model: "",
                    choices: [],
                };
                try {
                    const body = {
                        model: model,
                        max_tokens: maxTokens,
                        temperature: temperature,
                        messages: messages,
                    };
                    const [chat, err] = yield doPost(`${this.url}/chat/completions`, this.apiKey, body);
                    if (err != null) {
                        return [zeroChat, err];
                    }
                    return [chat, null];
                }
                catch (e) {
                    return [zeroChat, { error: JSON.stringify(e) }];
                }
            });
        }
        Completions(model, maxTokens, temperature, prompt) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const body = {
                        model: model,
                        max_tokens: maxTokens,
                        temperature: temperature,
                        prompt: prompt,
                    };
                    return doPost(`${this.url}/completions`, this.apiKey, body);
                }
                catch (e) {
                    return [null, e];
                }
            });
        }
        Factuality(reference, text) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const body = {
                        reference: reference,
                        text: text,
                    };
                    return doPost(`${this.url}/factuality`, this.apiKey, body);
                }
                catch (e) {
                    return [null, e];
                }
            });
        }
        Injection(prompt) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const body = {
                        prompt: prompt,
                        detect: true,
                    };
                    return doPost(`${this.url}/injection`, this.apiKey, body);
                }
                catch (e) {
                    return [null, e];
                }
            });
        }
        ReplacePI(prompt, replaceMethod) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const body = {
                        prompt: prompt,
                        replace: true,
                        replace_method: replaceMethod,
                    };
                    return doPost(`${this.url}/PII`, this.apiKey, body);
                }
                catch (e) {
                    return [null, e];
                }
            });
        }
        Toxicity(text) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const body = {
                        text: text,
                    };
                    return doPost(`${this.url}/toxicity`, this.apiKey, body);
                }
                catch (e) {
                    return [null, e];
                }
            });
        }
        Translate(text, sourceLang, targetLang) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const body = {
                        text: text,
                        source_lang: sourceLang,
                        target_lang: targetLang,
                    };
                    return doPost(`${this.url}/translate`, this.apiKey, body);
                }
                catch (e) {
                    return [null, e];
                }
            });
        }
    }
    client.Client = Client;
})(client || (client = {}));
export default client;
// =============================================================================
function doGet(url, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url, {
                method: 'get',
                headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
            });
            if (response.status != 200) {
                switch (response.status) {
                    case 404:
                        return [null, 'url not found'];
                    case 401:
                        return [null, 'api understands the request but refuses to authorize it'];
                    default:
                        const result = yield response.json();
                        return [null, result];
                }
            }
            const contextType = response.headers.get('content-type');
            var result;
            switch (true) {
                case contextType === null || contextType === void 0 ? void 0 : contextType.startsWith('text/plain'):
                    result = yield response.text();
                case contextType === null || contextType === void 0 ? void 0 : contextType.startsWith('application/json'):
                    result = yield response.json();
            }
            return [result, null];
        }
        catch (e) {
            return [null, e];
        }
    });
}
function doPost(url, apiKey, body) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url, {
                method: 'post',
                headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                body: JSON.stringify(body),
            });
            if (response.status != 200) {
                switch (response.status) {
                    case 404:
                        return [null, 'url not found'];
                    case 401:
                        return [null, 'api understands the request but refuses to authorize it'];
                    default:
                        const result = yield response.json();
                        return [null, result];
                }
            }
            const contextType = response.headers.get('content-type');
            var result;
            switch (true) {
                case contextType === null || contextType === void 0 ? void 0 : contextType.startsWith('text/plain'):
                    result = yield response.text();
                case contextType === null || contextType === void 0 ? void 0 : contextType.startsWith('application/json'):
                    result = yield response.json();
            }
            return [result, null];
        }
        catch (e) {
            return [null, e];
        }
    });
}

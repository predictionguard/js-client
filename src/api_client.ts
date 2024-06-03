import fetch from 'node-fetch';
import * as sse from 'fetch-sse';
import * as model from './api_model.js';

/** Client provides access to make raw http calls. */
export class Client {
    private url: string;
    private apiKey: string;

    // -------------------------------------------------------------------------

    /** constructor constructs a client API for use.
     *
     * @param {string} url - url represents the transport and domain:port.
     * @param {string} apiKey - apiKey represents PG api key.
     */
    constructor(url: string, apiKey: string) {
        this.url = url;
        this.apiKey = apiKey;
    }

    // -------------------------------------------------------------------------
    // Chat

    /** Chat generates chat completions based on a conversation history.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.chat.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Chat() {
     *     const model = pg.chat.Model.NeuralChat7B;
     *     const input = [
     *         {
     *             role: pg.chat.Role.User,
     *             content: 'How do you feel about the world in general',
     *         },
     *     ];
     *     const maxTokens = 1000;
     *     const temperature = 1.1;
     *
     *     var [result, err] = await client.Chat(model, input, maxTokens, temperature);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.model + ': ' + result.choices[0].message.content);
     * }
     *
     * Chat();
     * ```
     *
     * @param {Model} model - model represents the model to use for the
     * request.
     * @param {ChatInput[]} input - input represents the conversation history
     * with roles (user, assistant) and messages.
     * @param {number} maxTokens - maxTokens represents the maximum number
     * of tokens in the generated chat.
     * @param {number} temperature - temperature represents the parameter
     * for controlling randomness in generated chat.
     *
     * @returns - A Promise with a Chat object and a client.Error object if
     * the error is not null.
     */
    async Chat(model: model.Models, input: model.ChatInput[], maxTokens: number, temperature: number): Promise<[model.Chat, model.Error | null]> {
        const zero: model.Chat = {
            id: '',
            object: '',
            created: 0,
            model: model,
            choices: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const body = {
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                messages: input,
            };

            const [result, err] = await this.RawDoPost('chat/completions', body);
            if (err != null) {
                return [zero, err];
            }

            const chat = result as model.Chat;
            chat.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [chat, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    /** ChatSSE generates a stream of chat completions based on a
     * conversation history.
     *
     * @example
     * ```
     * import * as pg from '../dist/index.js';
     *
     * const client = new pg.chat.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function ChatSSE() {
     *     const model = pg.chat.Model.NeuralChat7B;
     *     const input = [
     *         {
     *             role: pg.chat.Role.User,
     *             content: 'How do you feel about the world in general',
     *         },
     *     ];
     *     const maxTokens = 1000;
     *     const temperature = 1.1;
     *
     *     const onMessage = function (event, err) {
     *         if (err != null) {
     *             if (err.error == 'EOF') {
     *                 return;
     *             }
     *             console.log(err);
     *         }
     *
     *         for (const choice of event.choices) {
     *             if (choice.delta.hasOwnProperty('content')) {
     *                 process.stdout.write(choice.delta.content);
     *             }
     *         }
     *     };
     *
     *     var err = await client.ChatSSE(model, input, maxTokens, temperature, onMessage);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     * }
     *
     * ChatSSE();
     * ```
     *
     * @param {Model} model - model represents the model to use for the
     * request.
     * @param {ChatInput[]} input - input represents the conversation history
     * with roles (user, assistant) and messages.
     * @param {number} maxTokens - maxTokens represents the maximum number
     * of tokens in the generated chat.
     * @param {number} temperature - temperature represents the parameter
     * for controlling randomness in the generated chat.
     * @param {(event: ChatSSE | null, err: client.Error | null) => void} onMessage -
     * onMessage represents a function that will receive the stream of chat
     * results.
     *
     * @returns - A Promise with a client.Error object if the error is not
     * null.
     */
    async ChatSSE(model: model.Models, input: model.ChatInput[], maxTokens: number, temperature: number, onMessage: (event: model.ChatSSE | null, err: model.Error | null) => void): Promise<model.Error | null> {
        try {
            const body = {
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                messages: input,
                stream: true,
            };

            const f = function (event: sse.ServerSentEvent | null, err: model.Error | null) {
                if (event == null) {
                    return;
                }

                const chatSSE = JSON.parse(event.data) as model.ChatSSE;
                chatSSE.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                onMessage(chatSSE, err);
            };

            const err = await this.RawDoSSEPost('chat/completions', body, f);
            if (err != null) {
                return err;
            }

            return null;
        } catch (e) {
            return {error: JSON.stringify(e)};
        }
    }

    /** ChatVision generates answers a question about an image.
     *
     * @example
     * ```
     * ```
     *
     * @param {Role} role - role represents the role of the person asking
     * the question.
     * @param {string} question - question represents the question being
     * asked.
     * @param {Base64Encoder} image - image represents an object that can
     * produce a base64 encoding of an image.
     * @param {number} maxTokens - maxTokens represents the maximum number
     * of tokens in the generated chat.
     * @param {number} temperature - temperature represents the parameter
     * for controlling randomness in the generated chat.
     * @param {(event: ChatSSE | null, err: client.Error | null) => void} onMessage -
     * onMessage represents a function that will receive the stream of chat
     * results.
     *
     * @returns - A Promise with a ChatVision object and a client.Error
     * object if the error is not null.
     */
    async ChatVision(role: model.Roles, question: string, image: model.Base64Encoder, maxTokens: number, temperature: number): Promise<[model.ChatVision, model.Error | null]> {
        const zero: model.ChatVision = {
            id: '',
            object: '',
            created: 0,
            model: model.Models.NeuralChat7B,
            choices: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const [base64, err1] = image.EncodeBase64();
            if (err1 != null) {
                return [zero, err1];
            }

            const body = {
                model: 'bridgetower-large-itm-mlm-itc',
                messages: [
                    {
                        role: role,
                        content: [
                            {
                                type: 'text',
                                text: question,
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: base64,
                                },
                            },
                        ],
                    },
                ],
                MaxTokens: maxTokens,
                Temperature: temperature,
            };

            const [result, err2] = await this.RawDoPost('chat/completions', body);
            if (err2 != null) {
                return [zero, err2];
            }

            const chat = result as model.ChatVision;
            chat.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [chat, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // Completion

    /** Completion generates text completions based on the provided input.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.completion.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Completions() {
     *     const model = pg.completion.Model.NeuralChat7B;
     *     const maxTokens = 1000;
     *     const temperature = 1.1;
     *     const prompt = 'Will I lose my hair';
     *
     *     var [result, err] = await client.Completion(model, maxTokens, temperature, prompt);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.choices[0].text);
     * }
     *
     * Completions();
     * ```
     *
     * @param {Model} model - model represents the model to use for the
     * request.
     * @param {number} maxTokens - maxTokens represents the maximum number
     * of tokens in the generated chat.
     * @param {number} temperature - temperature represents the parameter
     * for controlling randomness in generated chat.
     * @param {number} temperature - prompt represents the chat input.
     *
     * @returns - A Promise with a Completion object and a client.Error
     * object if the error is not null.
     */
    async Completion(model: model.Models, maxTokens: number, temperature: number, prompt: string): Promise<[model.Completion, model.Error | null]> {
        const zero: model.Completion = {
            id: '',
            object: '',
            created: 0,
            choices: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const body = {
                model: model,
                max_tokens: maxTokens,
                temperature: temperature,
                prompt: prompt,
            };

            const [result, err] = await this.RawDoPost('completions', body);
            if (err != null) {
                return [zero, err];
            }

            const chat = result as model.Completion;
            chat.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [chat, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // Factuality

    /** Factuality checks the factuality of a given text compared to a reference.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.factuality.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Factuality() {
     *     const fact = `The President shall receive in full for his services during
     *     the term for which he shall have been elected compensation in the aggregate
     *     amount of 400,000 a year, to be paid monthly, and in addition an expense
     *     allowance of 50,000 to assist in defraying expenses relating to or resulting
     *     from the discharge of his official duties. Any unused amount of such expense
     *     allowance shall revert to the Treasury pursuant to section 1552 of title 31,
     *     United States Code. No amount of such expense allowance shall be included in
     *     the gross income of the President. He shall be entitled also to the use of
     *     the furniture and other effects belonging to the United States and kept in
     *     the Executive Residence at the White House.`;
     *
     *     const text = `The president of the united states can take a salary of one
     *     million dollars`;
     *
     *     var [result, err] = await client.Factuality(fact, text);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + JSON.stringify(result.checks[0]));
     * }
     *
     * Factuality();
     * ```
     *
     * @param {string} reference - reference represents the reference text
     * for comparison.
     * @param {string} text - text represents the text to be checked
     * for factuality.
     *
     * @returns - A Promise with a Factuality object and a client.Error
     * object if the error is not null.
     */
    async Factuality(reference: string, text: string): Promise<[model.Factuality, model.Error | null]> {
        const zero: model.Factuality = {
            id: '',
            object: '',
            created: 0,
            checks: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const body = {
                reference: reference,
                text: text,
            };

            const [result, err] = await this.RawDoPost('factuality', body);
            if (err != null) {
                return [zero, err];
            }

            const factuality = result as model.Factuality;
            factuality.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [factuality, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // HealthCheck

    /** HealthCheck validates the PG API Service is available.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.health.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function HealthCheck() {
     *     var [result, err] = await client.HealthCheck();
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log(result);
     * }
     *
     * HealthCheck();
     * ```
     *
     * @returns - A Promise with a string and a client.Error object if
     * the error is not null.
     */
    async HealthCheck(): Promise<[string, model.Error | null]> {
        const zero: string = '';

        try {
            const [result, err] = await this.RawDoGet('');
            if (err != null) {
                return [zero, err];
            }

            return [result as string, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // Injection

    /** Injection detects potential prompt injection attacks in a given prompt.
     *
     * @example
     * ```
     *import * as pg from 'predictionguard';
     *
     *const client = new pg.injection.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     *async function Injection() {
     *    const prompt = `A short poem may be a stylistic choice or it may be that you
     *    have said what you intended to say in a more concise way.`;
     *
     *    var [result, err] = await client.Injection(prompt);
     *    if (err != null) {
     *        console.log('ERROR:' + err.error);
     *        return;
     *    }
     *
     *    console.log('RESULT:' + result.checks[0].probability);
     *}
     *
     *Injection();
     * ```
     *
     * @param {string} prompt - prompt represents the text to detect
     * injection attacks against.
     *
     * @returns - A Promise with a Injection object and a client.Error
     * object if the error is not null.
     */
    async Injection(prompt: string): Promise<[model.Injection, model.Error | null]> {
        const zero: model.Injection = {
            id: '',
            object: '',
            created: 0,
            checks: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const body = {
                prompt: prompt,
                detect: true,
            };

            const [result, err] = await this.RawDoPost('injection', body);
            if (err != null) {
                return [zero, err];
            }

            const injection = result as model.Injection;
            injection.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [injection, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // ReplacePI

    /** ReplacePI replaces personal information such as names, SSNs, and
     * emails in a given text.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.replacepi.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function ReplacePI() {
     *     const replaceMethod = pg.replacepi.ReplaceMethod.Mask;
     *     const prompt = `My email is bill@ardanlabs.com and my number is 954-123-4567.`;
     *
     *     var [result, err] = await client.ReplacePI(replaceMethod, prompt);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.checks[0].new_prompt);
     * }
     *
     * ReplacePI();
     * ```
     *
     * @param {ReplaceMethod} replaceMethod - replaceMethod represents the
     * method to use for replacing personal information.
     * @param {string} prompt - prompt represents the text to detect
     * injection attacks against.
     *
     * @returns - A Promise with a ReplacePI object and a client.Error
     * object if the error is not null.
     * */
    async ReplacePI(replaceMethod: model.ReplaceMethods, prompt: string): Promise<[model.ReplacePI, model.Error | null]> {
        const zero: model.ReplacePI = {
            id: '',
            object: '',
            created: 0,
            checks: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const body = {
                prompt: prompt,
                replace: true,
                replace_method: replaceMethod,
            };

            const [result, err] = await this.RawDoPost('PII', body);
            if (err != null) {
                return [zero, err];
            }

            const replacePI = result as model.ReplacePI;
            replacePI.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [replacePI, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // Toxicity

    /** Toxicity checks the toxicity of a given text.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.toxicity.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Toxicity() {
     *     const text = `Every flight I have is late and I am very angry. I want to
     *     hurt someone.`;
     *
     *     var [result, err] = await client.Toxicity(text);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.checks[0].score);
     * }
     *
     * Toxicity();
     * ```
     *
     * @param {string} text - text represents the text to be scored
     * for toxicity.
     *
     * @returns - A Promise with a Toxicity object and a client.Error
     * object if the error is not null.
     */
    async Toxicity(text: string): Promise<[model.Toxicity, model.Error | null]> {
        const zero: model.Toxicity = {
            id: '',
            object: '',
            created: 0,
            checks: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const body = {
                text: text,
            };

            const [result, err] = await this.RawDoPost('toxicity', body);
            if (err != null) {
                return [zero, err];
            }

            const toxicity = result as model.Toxicity;
            toxicity.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [toxicity, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // Translate

    /** Translate converts text from one language to another.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.translate.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Translate() {
     *     const sourceLang = pg.translate.Language.English;
     *     const targetLang = pg.translate.Language.Spanish;
     *     const text = `The rain in Spain stays mainly in the plain`;
     *
     *     var [result, err] = await client.Translate(text, sourceLang, targetLang);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.best_translation);
     * }
     *
     * Translate();
     * ```
     *
     * @param {string} text - text represents the text to be translated.
     * @param {Language} sourceLang - sourceLang represents the source
     * language of the text.
     * @param {Language} targetLang - targetLang represents the target
     * language of the text.
     *
     * @returns - A Promise with a Translate object and a client.Error
     * object if the error is not null.
     */
    async Translate(text: string, sourceLang: model.Languages, targetLang: model.Languages): Promise<[model.Translate, model.Error | null]> {
        const zero: model.Translate = {
            id: '',
            object: '',
            created: 0,
            best_translation: '',
            best_translation_model: '',
            best_score: 0,
            translations: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const body = {
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang,
            };

            const [result, err] = await this.RawDoPost('translate', body);
            if (err != null) {
                return [zero, err];
            }

            const translate = result as model.Translate;
            translate.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [translate, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------

    /** RawDoGet performs a raw GET call.
     *
     * @param {string} endpoint - endpoint represents endpoint to call and
     * does not include the transport or domain.
     *
     * @returns - A Promise with a respose object and an error object if
     * the error is not null.
     */
    protected async RawDoGet(endpoint: string): Promise<[any, model.Error | null]> {
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
                        return [null, result as model.Error];
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
    protected async RawDoPost(endpoint: string, body: any): Promise<[any, model.Error | null]> {
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
                        return [null, result as model.Error];
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
    protected async RawDoSSEPost(endpoint: string, body: any, onMessage: (event: sse.ServerSentEvent | null, err: model.Error | null) => void): Promise<model.Error | null> {
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
                                onMessage(null, result as model.Error);
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

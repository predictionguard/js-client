import fetch from 'node-fetch';
import * as sse from 'fetch-sse';
import * as model from './api_model.js';

const version = '0.32.1';

/** Client provides access the PredictionGuard API. */
export class Client {
    private url: string;
    private apiKey: string;

    // -------------------------------------------------------------------------

    /** constructor constructs a Client API for use.
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
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Chat() {
     *     const input = {
     *         model: 'Neural-Chat-7B',
     *         messages: 'How do you feel about the world in general',
     *         maxTokens: 1000,
     *         temperature: 0.1,
     *         topP: 0.1,
     *         topK: 50,
     *         inputExtension: {
     *             pii: pg.PIIs.Replace,
     *             piiReplaceMethod: pg.ReplaceMethods.Random,
     *         },
     *         outputExtension: {
     *             factuality: true,
     *             toxicity: true,
     *         },
     *     };
     *
     *     var [result, err] = await client.Chat(input);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
     * }
     *
     * async function ChatMulti() {
     *     const input = {
     *         model: 'Neural-Chat-7B',
     *         messages: [
     *             {
     *                 role: pg.Roles.User,
     *                 content: 'How do you feel about the world in general',
     *             },
     *         ],
     *         maxTokens: 1000,
     *         temperature: 0.1,
     *         topP: 0.1,
     *         topK: 50,
     *         inputExtension: {
     *             pii: pg.PIIs.Replace,
     *             piiReplaceMethod: pg.ReplaceMethods.Random,
     *         },
     *         outputExtension: {
     *             factuality: true,
     *             toxicity: true,
     *         },
     *     };
     *
     *     var [result, err] = await client.Chat(input);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
     * }
     *
     * Chat();
     * ChatMulti();
     * ```
     *
     * @param {model.ChatInput | model.ChatInputMulti} input - input represents the entire set of
     * possible input for the Chat call.
     *
     * @returns - A Promise with a Chat object and an Error object if
     * the error is not null.
     */
    async Chat(input: model.ChatInput | model.ChatInputMulti): Promise<[model.Chat, model.Error | null]> {
        const zero: model.Chat = {
            id: '',
            object: '',
            created: 0,
            model: input.model,
            choices: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            if (!('model' in input)) {
                return [zero, {error: 'model is a mandatory input'}];
            }

            if (!('messages' in input)) {
                return [zero, {error: 'messages is a mandatory input'}];
            }

            const m = new Map();
            m.set('model', input.model);
            m.set('messages', (input as any).messages);

            if ('maxTokens' in input) {
                m.set('max_tokens', (input as any).maxTokens);
            }

            if ('maxCompletionTokens' in input) {
                m.set('max_completion_tokens', (input as any).maxCompletionTokens);
            }

            if ('temperature' in input) {
                m.set('temperature', (input as any).temperature);
            }

            if ('topP' in input) {
                m.set('top_p', (input as any).topP);
            }

            if ('topK' in input) {
                m.set('top_k', (input as any).topK);
            }

            if ('frequencyPenalty' in input) {
                m.set('frequency_penalty', (input as any).frequencyPenalty);
            }

            if ('presencePenalty' in input) {
                m.set('presence_penalty', (input as any).presencePenalty);
            }

            if ('logitBias' in input) {
                m.set('logit_bias', (input as any).logitBias);
            }

            if ('stop' in input) {
                m.set('stop', (input as any).stop);
            }

            if ('reasoningEffort' in input) {
                m.set('reasoning_effort', (input as any).reasoningEffort);
            }

            if ('toolChoice' in input) {
                m.set('tool_choice', (input as any).toolChoice);
            }

            if ('tools' in input) {
                m.set('tools', (input as any).tools);
            }

            if ('parallelToolCalls' in input) {
                m.set('parallel_tool_calls', (input as any).parallelToolCalls);
            }

            // ---- FIX: inputExtension safe narrowing
            const ie = (input as any).inputExtension;
            if (ie && (ie.blockPromptInjection != null || ie.pii != null || ie.piiReplaceMethod != null)) {
                const inp = {
                    block_prompt_injection: ie.blockPromptInjection ?? false,
                    pii: ie.pii ?? '',
                    pii_replace_method: ie.piiReplaceMethod ?? '',
                };
                m.set('input', inp);
            }

            // ---- FIX: outputExtension safe narrowing
            const oe = (input as any).outputExtension;
            if (oe && (oe.factuality != null || oe.toxicity != null)) {
                const output = {
                    factuality: oe.factuality ?? false,
                    toxicity: oe.toxicity ?? false,
                };
                m.set('output', output);
            }

            const body = Object.fromEntries(m.entries());

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
     * import * as pg from 'predictiongaurd';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function ChatSSE() {
     *     const input = {
     *         model: 'Neural-Chat-7B',
     *         messages: [
     *             {
     *                 role: pg.Roles.User,
     *                 content: 'How do you feel about the world in general',
     *             },
     *         ],
     *         maxTokens: 1000,
     *         temperature: 0.1,
     *         topP: 0.1,
     *         topK: 50,
     *         inputExtension: {
     *             pii: pg.PIIs.Replace,
     *             piiReplaceMethod: pg.ReplaceMethods.Random,
     *         },
     *         onMessage: function (event, err) {
     *             if (err != null) {
     *                 if (err.error == 'EOF') {
     *                     return;
     *                 }
     *
     *                 console.log('ERROR 1:' + err.error);
     *                 return;
     *             }
     *
     *             if (event.error != '') {
     *                 console.log('ERROR 2:' + err.error);
     *                 return;
     *             }
     *
     *             for (const choice of event.choices) {
     *                 if (choice.delta.hasOwnProperty('content')) {
     *                     process.stdout.write(choice.delta.content);
     *                 }
     *             }
     *         },
     *     };
     *
     *     var err = await client.ChatSSE(input);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     * }
     *
     * ChatSSE();
     * ```
     *
     * @param {model.ChatSSEInput} input - input represents the entire set of
     * possible input for the SSE Chat call.
     *
     * @returns - A Promise with an Error object if the error is not
     * null.
     */
    async ChatSSE(input: model.ChatSSEInput): Promise<model.Error | null> {
        try {
            if (!('model' in input)) {
                return {error: 'model is a mandatory input'};
            }

            if (!('messages' in input)) {
                return {error: 'messages is a mandatory input'};
            }

            if (!('onMessage' in input)) {
                return {error: 'onMessage is a mandatory input'};
            }

            const m = new Map();
            m.set('model', input.model);
            m.set('messages', input.messages);
            m.set('stream', true);

            if ('maxTokens' in input) {
                m.set('max_tokens', input.maxTokens);
            }

            if ('maxCompletionTokens' in input) {
                m.set('max_completion_tokens', input.maxCompletionTokens);
            }

            if ('temperature' in input) {
                m.set('temperature', input.temperature);
            }

            if ('topP' in input) {
                m.set('top_p', input.topP);
            }

            if ('topK' in input) {
                m.set('top_k', input.topK);
            }

            if ('frequencyPenalty' in input) {
                m.set('frequency_penalty', input.frequencyPenalty);
            }

            if ('presencePenalty' in input) {
                m.set('presence_penalty', input.presencePenalty);
            }

            if ('logitBias' in input) {
                m.set('logit_bias', input.logitBias);
            }

            if ('stop' in input) {
                m.set('stop', input.stop);
            }

            if ('reasoningEffort' in input) {
                m.set('reasoning_effort', input.reasoningEffort);
            }

            if ('toolChoice' in input) {
                m.set('tool_choice', input.toolChoice);
            }

            if ('tools' in input) {
                m.set('tools', input.tools);
            }

            if ('parallelToolCalls' in input) {
                m.set('parallel_tool_calls', input.parallelToolCalls);
            }

            // ---- FIX: inputExtension safe narrowing
            const ie = (input as any).inputExtension;
            if (ie && (ie.blockPromptInjection != null || ie.pii != null || ie.piiReplaceMethod != null)) {
                const inp = {
                    block_prompt_injection: ie.blockPromptInjection ?? false,
                    pii: ie.pii ?? '',
                    pii_replace_method: ie.piiReplaceMethod ?? '',
                };
                m.set('input', inp);
            }

            const body = Object.fromEntries(m.entries());

            const f = function (event: sse.ServerSentEvent | null, err: model.Error | null) {
                if (event == null) {
                    return;
                }

                const chatSSE = JSON.parse(event.data) as model.ChatSSE;
                chatSSE.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                // Bill: Earlier versions of the API didn't set this field so it
                // could be undefined. When V2 is 100% running, we can remove
                // this code.
                if (typeof (chatSSE as any).error === 'undefined') {
                    (chatSSE as any).error = '';
                }

                input.onMessage(chatSSE, err);
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
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function ChatVision() {
     *     const image = new pg.ImageNetwork('https://pbs.twimg.com/profile_images/1571574401107169282/ylAgz_f5_400x400.jpg');
     *
     *     const input = {
     *         role: pg.Roles.User,
     *         question: 'is there a deer in this picture',
     *         image: image,
     *         maxTokens: 1000,
     *         temperature: 0.1,
     *         topP: 0.1,
     *         topK: 50,
     *         inputExtension: {
     *             pii: pg.PIIs.Replace,
     *             piiReplaceMethod: pg.ReplaceMethods.Random,
     *         },
     *         outputExtension: {
     *             factuality: true,
     *             toxicity: true,
     *         },
     *     };
     *
     *     var [result, err] = await client.ChatVision(input);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
     * }
     *
     * ChatVision();
     * ```
     *
     * @param {model.ChatVisionInput} input - input represents the entire set of
     * possible input for the Vision Chat call.
     *
     * @returns - A Promise with a ChatVision object and a Error
     * object if the error is not null.
     */
    async ChatVision(input: model.ChatVisionInput): Promise<[model.ChatVision, model.Error | null]> {
        const zero: model.ChatVision = {
            id: '',
            object: '',
            created: 0,
            model: '',
            choices: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            if (!('model' in input)) {
                return [zero, {error: 'model is a mandatory input'}];
            }

            if (!('role' in input)) {
                return [zero, {error: 'role is a mandatory input'}];
            }

            if (!('question' in input)) {
                return [zero, {error: 'question is a mandatory input'}];
            }

            if (!('image' in input)) {
                return [zero, {error: 'image is a mandatory input'}];
            }

            const [b64, err1] = await input.image.EncodeBase64();
            if (err1 != null) {
                return [zero, err1];
            }

            const m = new Map();
            m.set('model', input.model);
            m.set('messages', [
                {
                    role: input.role,
                    content: [
                        {
                            type: 'text',
                            text: input.question,
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: 'data:image/jpeg;base64,' + b64,
                            },
                        },
                    ],
                },
            ]);

            if ('maxTokens' in input) {
                m.set('max_tokens', input.maxTokens);
            }

            if ('maxCompletionTokens' in input) {
                m.set('max_completion_tokens', input.maxCompletionTokens);
            }

            if ('temperature' in input) {
                m.set('temperature', input.temperature);
            }

            if ('topP' in input) {
                m.set('top_p', input.topP);
            }

            if ('topK' in input) {
                m.set('top_k', input.topK);
            }

            if ('frequencyPenalty' in input) {
                m.set('frequency_penalty', input.frequencyPenalty);
            }

            if ('presencePenalty' in input) {
                m.set('presence_penalty', input.presencePenalty);
            }

            if ('logitBias' in input) {
                m.set('logit_bias', input.logitBias);
            }

            if ('stop' in input) {
                m.set('stop', input.stop);
            }

            if ('reasoningEffort' in input) {
                m.set('reasoning_effort', input.reasoningEffort);
            }

            if ('toolChoice' in input) {
                m.set('tool_choice', input.toolChoice);
            }

            if ('tools' in input) {
                m.set('tools', input.tools);
            }

            if ('parallelToolCalls' in input) {
                m.set('parallel_tool_calls', input.parallelToolCalls);
            }

            // ---- FIX: inputExtension safe narrowing
            const ie = (input as any).inputExtension;
            if (ie && (ie.blockPromptInjection != null || ie.pii != null || ie.piiReplaceMethod != null)) {
                const inp = {
                    block_prompt_injection: ie.blockPromptInjection ?? false,
                    pii: ie.pii ?? '',
                    pii_replace_method: ie.piiReplaceMethod ?? '',
                };
                m.set('input', inp);
            }

            // ---- FIX: outputExtension safe narrowing
            const oe = (input as any).outputExtension;
            if (oe && (oe.factuality != null || oe.toxicity != null)) {
                const output = {
                    factuality: oe.factuality ?? false,
                    toxicity: oe.toxicity ?? false,
                };
                m.set('output', output);
            }

            const body = Object.fromEntries(m.entries());

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
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Completions() {
     *     const input = {
     *         model: 'Neural-Chat-7B',
     *         prompt: 'Will I lose my hair',
     *         maxTokens: 1000,
     *         temperature: 0.1,
     *         topP: 0.1,
     *         topK: 50,
     *         inputExtension: {
     *             pii: pg.PIIs.Replace,
     *             piiReplaceMethod: pg.ReplaceMethods.Random,
     *         },
     *         outputExtension: {
     *             factuality: true,
     *             toxicity: true,
     *         },
     *     };
     *
     *     var [result, err] = await client.Completion(input);
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
     * @param {model.CompletionInput} input - input represents the entire set of
     * possible input for the Completion call.
     *
     * @returns - A Promise with a Completion object and a Error
     * object if the error is not null.
     */
    async Completion(input: model.CompletionInput): Promise<[model.Completion, model.Error | null]> {
        const zero: model.Completion = {
            id: '',
            object: '',
            created: 0,
            model: '',
            choices: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            if (!('model' in input)) {
                return [zero, {error: 'model is a mandatory input'}];
            }

            if (!('prompt' in input)) {
                return [zero, {error: 'prompt is a mandatory input'}];
            }

            const m = new Map();
            m.set('model', input.model);
            m.set('prompt', input.prompt);

            if ('maxTokens' in input) {
                m.set('max_tokens', input.maxTokens);
            }

            if ('temperature' in input) {
                m.set('temperature', input.temperature);
            }

            if ('topP' in input) {
                m.set('top_p', input.topP);
            }

            if ('topK' in input) {
                m.set('top_k', input.topK);
            }

            if ('frequencyPenalty' in input) {
                m.set('frequency_penalty', input.frequencyPenalty);
            }

            if ('presencePenalty' in input) {
                m.set('presence_penalty', input.presencePenalty);
            }

            if ('logitBias' in input) {
                m.set('logit_bias', input.logitBias);
            }

            if ('stop' in input) {
                m.set('stop', input.stop);
            }

            if ('stream' in input) {
                m.set('stream', input.stream);
            }

            // ---- FIX: inputExtension safe narrowing
            const ie = (input as any).inputExtension;
            if (ie && (ie.blockPromptInjection != null || ie.pii != null || ie.piiReplaceMethod != null)) {
                const inp = {
                    block_prompt_injection: ie.blockPromptInjection ?? false,
                    pii: ie.pii ?? '',
                    pii_replace_method: ie.piiReplaceMethod ?? '',
                };
                m.set('input', inp);
            }

            // ---- FIX: outputExtension safe narrowing
            const oe = (input as any).outputExtension;
            if (oe && (oe.factuality != null || oe.toxicity != null)) {
                const output = {
                    factuality: oe.factuality ?? false,
                    toxicity: oe.toxicity ?? false,
                };
                m.set('output', output);
            }

            const body = Object.fromEntries(m.entries());

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
    // Embedding

    /** Embedding generates chat completions based on a conversation history.
     *
     * @example
     * ```
     * import * as pg from 'predictiongaurd';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Embedding() {
     *     const image = new pg.ImageNetwork('https://pbs.twimg.com/profile_images/1571574401107169282/ylAgz_f5_400x400.jpg');
     *
     *     const input1 = [
     *         {
     *             text: 'This is Bill Kennedy, a decent Go developer.',
     *             image: image,
     *         },
     *     ];
     *
     *     var [result1, err] = await client.Embedding('bridgetower-large-itm-mlm-itc', input1);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     for (const dt of result1.data) {
     *         process.stdout.write(dt.embedding.toString());
     *     }
     *
     *     const input2 = [
     *         {
     *             text: 'This is Bill Kennedy, a decent Go developer.',
     *         },
     *     ];
     *
     *     var [result2, err] = await client.Embedding('multilingual-e5-large-instruct', input2, true, pg.Directions.Right);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     for (const dt of result2.data) {
     *         process.stdout.write(dt.embedding.toString());
     *     }
     * }
     *
     * Embedding();
     * ```
     *
     * @param {string} model - model to use.
     *
     * @param {(model.EmbeddingInput | number | number[])[]} input - input represents a collection of
     * text and images, numbers, or a slice of numbers to vectorize.
     *
     * @param {boolean} truncate - truncate represents whether to truncate the
     * input if it's too long. Not all models support this.
     *
     * @param {model.Directions} truncateDir - truncateDir represents the
     * direction to truncate, either Right or Left.
     *
     * @returns - A Promise with a Embedding object and an Error object if
     * the error is not null.
     */
    async Embedding(model: string, input: (model.EmbeddingInput | number | number[])[], truncate?: boolean, truncateDir?: model.Directions): Promise<[model.Embedding, model.Error | null]> {
        const zero: model.Embedding = {
            id: '',
            object: '',
            created: 0,
            model: '',
            data: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            if (input.length == 0) {
                return [zero, {error: 'no input provided'}];
            }

            let embeds: any;

            if (input[0] instanceof Array || typeof input[0] === 'number') {
                embeds = input;
            } else {
                const [inputs, err] = await this.embedInputs(input as model.EmbeddingInput[]);
                if (err != null) {
                    return [zero, err];
                }

                embeds = inputs;
            }

            const m = new Map();
            m.set('model', model);
            m.set('input', embeds);

            if (typeof truncate !== 'undefined') {
                m.set('truncate', truncate);
            }

            if (typeof truncateDir !== 'undefined') {
                m.set('truncate_direction', truncateDir);
            }

            const body = Object.fromEntries(m.entries());

            const [result, err] = await this.RawDoPost('embeddings', body);
            if (err != null) {
                return [zero, err];
            }

            const embedding = result as model.Embedding;
            embedding.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [embedding, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    private async embedInputs(input: model.EmbeddingInput[]): Promise<[object, model.Error | null]> {
        const embeds: any[] = [];

        for (const inp of input) {
            let base64 = '';
            if (inp.image != null) {
                const [b64, err1] = await inp.image.EncodeBase64();
                if (err1 != null) {
                    return [{}, err1];
                }
                base64 = b64;
            }

            embeds.push({
                text: inp.text,
                image: base64,
            });
        }

        return [embeds, null];
    }

    // -------------------------------------------------------------------------
    // Factuality

    /** Factuality checks the factuality of a given text compared to a reference.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
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
     * @returns - A Promise with a Factuality object and a Error
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
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
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
     * @returns - A Promise with a string and an Error object if
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
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Injection() {
     *     const prompt = `A short poem may be a stylistic choice or it may be that you
     *     have said what you intended to say in a more concise way.`;
     *
     *     var [result, err] = await client.Injection(prompt);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.checks[0].probability);
     * }
     *
     * Injection();
     * ```
     *
     * @param {string} prompt - prompt represents the text to detect
     * injection attacks against.
     *
     * @returns - A Promise with a Injection object and a Error
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
    // ReplacePII

    /** ReplacePII replaces personal information such as names, SSNs, and
     * emails in a given text.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function ReplacePII() {
     *     const replaceMethod = pg.ReplaceMethods.Mask;
     *     const prompt = `My email is bill@ardanlabs.com and my number is 954-123-4567.`;
     *
     *     var [result, err] = await client.ReplacePII(replaceMethod, prompt);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.checks[0].new_prompt);
     * }
     *
     * ReplacePII();
     * ```
     *
     * @param {model.ReplaceMethods} replaceMethod - replaceMethod represents the
     * method to use for replacing personal information.
     * @param {string} prompt - prompt represents the text to detect
     * injection attacks against.
     *
     * @returns - A Promise with a ReplacePII object and a Error
     * object if the error is not null.
     * */
    async ReplacePII(replaceMethod: model.ReplaceMethods, prompt: string): Promise<[model.ReplacePII, model.Error | null]> {
        const zero: model.ReplacePII = {
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

            const replacePII = result as model.ReplacePII;
            replacePII.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [replacePII, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // Rerank

    /** Rerank sorts text inputs by semantic relevance to a specified query.
     *
     * @example
     * ```
     * import * as pg from '../dist/index.js';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);
     *
     * async function Rerank() {
     *     const input = {
     *         model: 'bge-reranker-v2-m3',
     *         query: 'What is Deep Learning?',
     *         documents: ['Deep Learning is not pizza.', 'Deep Learning is pizza.'],
     *         returnDocuments: true,
     *     };
     *
     *     var [result, err] = await client.Rerank(input);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.results[0].relevance_score);
     * }
     *
     * Rerank();
     * ```
     *
     * @param {model.RerankInput} input - input represents the entire set of
     * possible input for the Rerank call.
     *
     * @returns - A Promise with a Rerank object and a Error
     * object if the error is not null.
     * */
    async Rerank(input: model.RerankInput): Promise<[model.Rerank, model.Error | null]> {
        const zero: model.Rerank = {
            id: '',
            object: '',
            created: 0,
            model: '',
            results: [],
            createdDate: function () {
                return new Date(0);
            },
        };

        try {
            const body = {
                model: input.model,
                query: input.query,
                documents: input.documents,
                return_documents: input.returnDocuments,
            };

            const [result, err] = await this.RawDoPost('rerank', body);
            if (err != null) {
                return [zero, err];
            }

            const rerank = result as model.Rerank;
            rerank.createdDate = function () {
                return new Date(this.created * 1000);
            };

            return [rerank, null];
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
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
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
     * @returns - A Promise with a Toxicity object and a Error
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
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function Translate() {
     *     const text = `The rain in Spain stays mainly in the plain`;
     *     const sourceLang = pg.Languages.English;
     *     const targetLang = pg.Languages.Spanish;
     *     const useThirdPartyEngine = false;
     *
     *     var [result, err] = await client.Translate(text, sourceLang, targetLang, useThirdPartyEngine);
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
     * @param {model.Languages} sourceLang - sourceLang represents the source
     * language of the text.
     * @param {model.Languages} targetLang - targetLang represents the target
     * language of the text.
     * @param {boolean} useThirdPartyEngine - Use third-party translation
     * engines such as OpenAI, DeepL, and Google. Defaults to false.
     *
     * @returns - A Promise with a Translate object and a Error
     * object if the error is not null.
     */
    async Translate(text: string, sourceLang: model.Languages, targetLang: model.Languages, useThirdPartyEngine: boolean): Promise<[model.Translate, model.Error | null]> {
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
                use_third_party_engine: useThirdPartyEngine,
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
    // CompletionSSE

    /** CompletionSSE generates a stream of text completions based on a prompt.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function CompletionSSE() {
     *     const input = {
     *         model: 'Neural-Chat-7B',
     *         prompt: 'Will I lose my hair?',
     *         maxTokens: 1000,
     *         temperature: 0.1,
     *         topP: 0.1,
     *         topK: 50,
     *         inputExtension: {
     *             pii: pg.PIIs.Replace,
     *             piiReplaceMethod: pg.ReplaceMethods.Random,
     *         },
     *         onMessage: function (event, err) {
     *             if (err != null) {
     *                 if (err.error == 'EOF') {
     *                     return;
     *                 }
     *                 console.log('ERROR:' + err.error);
     *                 return;
     *             }
     *
     *             for (const choice of event.choices) {
     *                 process.stdout.write(choice.text);
     *             }
     *         },
     *     };
     *
     *     var err = await client.CompletionSSE(input);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     * }
     *
     * CompletionSSE();
     * ```
     *
     * @param {model.CompletionSSEInput} input - input represents the entire set of
     * possible input for the SSE Completion call.
     *
     * @returns - A Promise with an Error object if the error is not null.
     */
    async CompletionSSE(input: model.CompletionSSEInput): Promise<model.Error | null> {
        try {
            if (!('model' in input)) {
                return {error: 'model is a mandatory input'};
            }

            if (!('prompt' in input)) {
                return {error: 'prompt is a mandatory input'};
            }

            if (!('onMessage' in input)) {
                return {error: 'onMessage is a mandatory input'};
            }

            const m = new Map();
            m.set('model', input.model);
            m.set('prompt', input.prompt);
            m.set('stream', true);

            if ('maxTokens' in input) {
                m.set('max_tokens', input.maxTokens);
            }

            if ('temperature' in input) {
                m.set('temperature', input.temperature);
            }

            if ('topP' in input) {
                m.set('top_p', input.topP);
            }

            if ('topK' in input) {
                m.set('top_k', input.topK);
            }

            if ('frequencyPenalty' in input) {
                m.set('frequency_penalty', input.frequencyPenalty);
            }

            if ('presencePenalty' in input) {
                m.set('presence_penalty', input.presencePenalty);
            }

            if ('logitBias' in input) {
                m.set('logit_bias', input.logitBias);
            }

            if ('stop' in input) {
                m.set('stop', input.stop);
            }

            // ---- FIX: inputExtension safe narrowing
            const ie = (input as any).inputExtension;
            if (ie && (ie.blockPromptInjection != null || ie.pii != null || ie.piiReplaceMethod != null)) {
                const inp = {
                    block_prompt_injection: ie.blockPromptInjection ?? false,
                    pii: ie.pii ?? '',
                    pii_replace_method: ie.piiReplaceMethod ?? '',
                };
                m.set('input', inp);
            }

            const body = Object.fromEntries(m.entries());

            const f = function (event: sse.ServerSentEvent | null, err: model.Error | null) {
                if (event == null) {
                    return;
                }

                const completionSSE = JSON.parse(event.data) as model.CompletionSSE;
                completionSSE.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                input.onMessage(completionSSE, err);
            };

            const err = await this.RawDoSSEPost('completions', body, f);
            if (err != null) {
                return err;
            }

            return null;
        } catch (e) {
            return {error: JSON.stringify(e)};
        }
    }

    // -------------------------------------------------------------------------
    // AudioTranscription

    /** AudioTranscription transcribes audio files to text.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     * import * as fs from 'fs';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function AudioTranscription() {
     *     const input = {
     *         model: 'whisper-1',
     *         file: './audio.wav',
     *         language: 'en',
     *         temperature: 0.1,
     *         timestampGranularities: [pg.TimestampGranularity.Word, pg.TimestampGranularity.Segment],
     *         diarization: true,
     *         responseFormat: pg.AudioResponseFormat.VerboseJson,
     *     };
     *
     *     var [result, err] = await client.AudioTranscription(input);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.text);
     * }
     *
     * AudioTranscription();
     * ```
     *
     * @param {model.AudioTranscriptionInput} input - input represents the entire set of
     * possible input for the AudioTranscription call.
     *
     * @returns - A Promise with an AudioTranscription object and an Error object if
     * the error is not null.
     */
    async AudioTranscription(input: model.AudioTranscriptionInput): Promise<[model.AudioTranscription, model.Error | null]> {
        const zero: model.AudioTranscription = {
            text: '',
        };

        try {
            if (!('model' in input)) {
                return [zero, {error: 'model is a mandatory input'}];
            }

            if (!('file' in input)) {
                return [zero, {error: 'file is a mandatory input'}];
            }

            const [result, err] = await this.RawDoMultipartPost('audio/transcriptions', input, {
                toxicity: (input as any).toxicity,
                pii: (input as any).pii,
                replaceMethod: (input as any).replaceMethod,
                injection: (input as any).injection,
            });

            if (err != null) {
                return [zero, err];
            }

            return [result as model.AudioTranscription, null];
        } catch (e) {
            return [zero, {error: JSON.stringify(e)}];
        }
    }

    // -------------------------------------------------------------------------
    // DocumentExtract

    /** DocumentExtract extracts text from documents using OCR.
     *
     * @example
     * ```
     * import * as pg from 'predictionguard';
     *
     * const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);
     *
     * async function DocumentExtract() {
     *     const input = {
     *         file: './document.pdf',
     *         embedImages: false,
     *         outputFormat: 'markdown',
     *         chunkDocument: true,
     *         chunkSize: 1000,
     *         enableOCR: true,
     *     };
     *
     *     var [result, err] = await client.DocumentExtract(input);
     *     if (err != null) {
     *         console.log('ERROR:' + err.error);
     *         return;
     *     }
     *
     *     console.log('RESULT:' + result.title + ': ' + result.count + ' words');
     * }
     *
     * DocumentExtract();
     * ```
     *
     * @param {model.DocumentExtractInput} input - input represents the entire set of
     * possible input for the DocumentExtract call.
     *
     * @returns - A Promise with a DocumentExtract object and an Error object if
     * the error is not null.
     */
    async DocumentExtract(input: model.DocumentExtractInput): Promise<[model.DocumentExtract, model.Error | null]> {
        const zero: model.DocumentExtract = {
            title: '',
            contents: '',
            count: 0,
        };

        try {
            if (!('file' in input)) {
                return [zero, {error: 'file is a mandatory input'}];
            }

            const [result, err] = await this.RawDoMultipartPost('documents/extract', input, {
                toxicity: (input as any).toxicity,
                pii: (input as any).pii,
                replaceMethod: (input as any).replaceMethod,
                injection: (input as any).injection,
            });

            if (err != null) {
                return [zero, err];
            }

            return [result as model.DocumentExtract, null];
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
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': `Prediction Guard JS Client: ${version}`,
                    Authorization: `Bearer ${this.apiKey}`,
                },
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

            let result: any;
            switch (true) {
                case !!contextType && contextType.startsWith('text/plain'):
                    result = await response.text();
                    break;

                case !!contextType && contextType.startsWith('application/json'):
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
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': `Prediction Guard JS Client: ${version}`,
                    Authorization: `Bearer ${this.apiKey}`,
                },
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

            let result: any;
            switch (true) {
                case !!contextType && contextType.startsWith('text/plain'):
                    result = await response.text();
                    break;

                case !!contextType && contextType.startsWith('application/json'):
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
     * @param {(event: sse.ServerSentEvent | null, err: model.Error | null) => void} onMessage -
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
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': `Prediction Guard JS Client: ${version}`,
                    Authorization: `Bearer ${this.apiKey}`,
                },

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
                                break;

                            case 403:
                                onMessage(null, {error: 'api understands the request but refuses to authorize it'});
                                break;

                            case 503:
                                onMessage(null, {error: 'service unavilable'});
                                break;

                            default:
                                try {
                                    const result = await response.json();
                                    onMessage(null, result as model.Error);
                                } catch {
                                    onMessage(null, {error: `http ${response.status}`});
                                }
                                break;
                        }
                    }
                },

                onError: (e) => {
                    if (Object.keys(e as any).length === 0) {
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

    /**
     * RawDoMultipartPost performs a raw POST call with multipart/form-data support.
     *
     * @param {string} endpoint - endpoint represents endpoint to call and
     * does not include the transport or domain.
     * @param {any} input - input represents the input object with file and other fields.
     * @param {object} headers - additional headers to include in the request.
     *
     * @returns - A Promise with a response object and an error object if
     * the error is not null.
     */
    protected async RawDoMultipartPost(endpoint: string, input: any, headers: any): Promise<[any, model.Error | null]> {
        try {
            const formData = new FormData();

            // Handle file - can be File object or path string
            if (input.file) {
                if (typeof input.file === 'string') {
                    // In Node.js environment, we need to read the file
                    const fs = await import('fs');
                    const path = await import('path');
                    const fileBuffer = (fs as any).readFileSync(input.file);
                    const fileName = (path as any).basename(input.file);
                    const blob = new Blob([fileBuffer]);
                    formData.append('file', blob, fileName);
                } else {
                    // Assume it's already a File object (browser environment)
                    formData.append('file', input.file);
                }
            }

            // Add other fields based on endpoint
            if (endpoint === 'audio/transcriptions') {
                if (input.model) formData.append('model', input.model);
                if (input.language) formData.append('language', input.language);
                if (input.prompt) formData.append('prompt', input.prompt);
                if (input.temperature !== undefined) formData.append('temperature', String(input.temperature));
                if (input.timestampGranularities) {
                    if (Array.isArray(input.timestampGranularities)) {
                        input.timestampGranularities.forEach((g: string) => formData.append('timestamps_granularities[]', g));
                    } else {
                        formData.append('timestamps_granularities[]', input.timestampGranularities);
                    }
                }
                if (input.diarization !== undefined) formData.append('diarization', String(input.diarization));
                if (input.responseFormat) formData.append('response_format', input.responseFormat);
            } else if (endpoint === 'documents/extract') {
                if (input.embedImages !== undefined) formData.append('embedImages', String(input.embedImages));
                if (input.outputFormat) formData.append('outputFormat', input.outputFormat);
                if (input.chunkDocument !== undefined) formData.append('chunkDocument', String(input.chunkDocument));
                if (input.chunkSize !== undefined) formData.append('chunkSize', String(input.chunkSize));
                if (input.enableOCR !== undefined) formData.append('enableOCR', String(input.enableOCR));
            }

            const requestHeaders: any = {
                'User-Agent': `Prediction Guard JS Client: ${version}`,
                Authorization: `Bearer ${this.apiKey}`,
            };

            // Add optional headers for PII, toxicity, injection
            if (headers && headers.toxicity !== undefined) {
                requestHeaders['Toxicity'] = String(headers.toxicity);
            }
            if (headers && headers.pii != null) {
                requestHeaders['Pii'] = headers.pii;
            }
            if (headers && headers.replaceMethod != null) {
                requestHeaders['Replace-Method'] = headers.replaceMethod;
            }
            if (headers && headers.injection !== undefined) {
                requestHeaders['Injection'] = String(headers.injection);
            }

            const response = await fetch(`${this.url}/${endpoint}`, {
                method: 'post',
                headers: requestHeaders,
                body: formData as any,
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

            let result: any;
            switch (true) {
                case !!contextType && contextType.startsWith('text/plain'):
                    result = await response.text();
                    break;

                case !!contextType && contextType.startsWith('application/json'):
                    result = await response.json();
                    break;
            }

            return [result, null];
        } catch (e) {
            return [null, {error: JSON.stringify(e)}];
        }
    }
}

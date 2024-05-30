import client from './api_client.js';
import * as sse from 'fetch-sse';

/** Module chat provides support for the chat endpoints. */
export module chat {
    /** Model represents the set of models that can be used. */
    export enum Model {
        Hermes2ProLlama38B = 'Hermes-2-Pro-Llama-3-8B',
        NousHermesLlama213B = 'Nous-Hermes-Llama-213B',
        Hermes2ProMistral7B = 'Hermes-2-Pro-Mistral-7B',
        NeuralChat7B = 'Neural-Chat-7B',
        Yi34BChat = 'Yi-34B-Chat',
        DeepseekCoder67BInstruct = 'deepseek-coder-6.7b-instruct',
    }

    /** Role represents the set of roles that a sender can represent themselves
     * as. */
    export enum Role {
        Assistant = 'assistant',
        User = 'user',
        System = 'system',
    }

    // -------------------------------------------------------------------------

    /** Message represents an object that contains the content and a role. It
     * can be used for input and returned as part of the response. */
    export interface Message {
        /** content represents the content of the message. */
        content: string;

        /** role represents the role of the sender (user or assistant). */
        role: Role;
    }

    /** Choice represents an object that contains a result choice. */
    export interface Choice {
        /** index represents the index position in the collection for
         * this choice. */
        index: number;

        /** message represents the message response for this choice. */
        message: Message;

        /** status represents if the response for this choice was successful
         * or not. */
        status: string;
    }

    /** Chat represents an object that contains the result for the chat call. */
    export interface Chat {
        /** id represents a unique identifier for the result. */
        id: string;

        /** object represent the type of the result document. */
        object: string;

        /** created represents the unix timestamp for when the request was
         * received. */
        created: number;

        /** model represents the model used for generating the result. */
        model: Model;

        /** choices represents the collection of choices to choose from. */
        choices: Choice[];

        /** createdDate converts the created unix timestamp into a JS Date. */
        createdDate(): Date;
    }

    // -------------------------------------------------------------------------

    /** SSEDelta represents an object that contains the content. */
    export interface SSEDelta {
        /** content represents the partial content response for a choice. */
        content: string;
    }

    /** SSEChoice represents an object that contains a result choice. */
    export interface SSEChoice {
        /** index represents the index position in the collection for
         * this choice. */
        index: number;

        /** delta represents the partial content for this choice. */
        delta: SSEDelta;

        /** generated_text represents the final completed chat response which
         * is provided when this is the last choice. */
        generated_text: string;

        /** logprobs represents the log probabilty of accuracy for this choice. */
        logprobs: number;

        /** finish_reason represents the reason the response has finished
         * which is provided when this is the last choice. */
        finish_reason: string;
    }

    /** ChatSSE represents an object that contains the result for the chatSSE
     * call. */
    export interface ChatSSE {
        /** id represents a unique identifier for the result. */
        id: string;

        /** object represent the type of the result document. */
        object: string;

        /** created represents the unix timestamp for when the request was
         * received. */
        created: number;

        /** model represents the model used for generating the result. */
        model: Model;

        /** choices represents the collection of choices to choose from. */
        choices: SSEChoice[];

        /** createdDate converts the created unix timestamp into a JS Date. */
        createdDate(): Date;
    }

    // -------------------------------------------------------------------------

    /** Client provides APIs to access the chat endpoints. */
    export class Client extends client.Client {
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
         * @param {Message[]} input - input represents the conversation history
         * with roles (user, assistant) and messages.
         * @param {number} maxTokens - maxTokens represents the maximum number
         * of tokens in the generated chat.
         * @param {number} temperature - temperature represents the parameter
         * for controlling randomness in generated chat.
         *
         * @returns - A Promise with a Chat object and a client.Error object if
         * the error is not null.
         */
        async Chat(model: Model, input: Message[], maxTokens: number, temperature: number): Promise<[Chat, client.Error | null]> {
            const zero: Chat = {
                id: '',
                object: '',
                created: 0,
                model: Model.NeuralChat7B,
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

                const chat = result as Chat;
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
         * @param {Message[]} input - input represents the conversation history
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
        async ChatSSE(model: Model, input: Message[], maxTokens: number, temperature: number, onMessage: (event: ChatSSE | null, err: client.Error | null) => void): Promise<client.Error | null> {
            try {
                const body = {
                    model: model,
                    max_tokens: maxTokens,
                    temperature: temperature,
                    messages: input,
                    stream: true,
                };

                const f = function (event: sse.ServerSentEvent | null, err: client.Error | null) {
                    if (event == null) {
                        return;
                    }

                    const chatSSE = JSON.parse(event.data) as ChatSSE;
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
    }
}

export default chat;

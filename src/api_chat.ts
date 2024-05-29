import client from './api_client.js';
import * as sse from 'fetch-sse';

export module chat {
    /**
     * Model represents the set of models that can be used.
     * @public
     */
    export enum Model {
        Hermes2ProLlama38B = 'Hermes-2-Pro-Llama-3-8B',
        NousHermesLlama213B = 'Nous-Hermes-Llama-213B',
        Hermes2ProMistral7B = 'Hermes-2-Pro-Mistral-7B',
        NeuralChat7B = 'Neural-Chat-7B',
        Yi34BChat = 'Yi-34B-Chat',
        DeepseekCoder67BInstruct = 'deepseek-coder-6.7b-instruct',
    }

    /**
     * Role represents the set of roles that can be used.
     * @public
     */
    export enum Role {
        /** Assistant represents an assistant who is responding. */
        Assistant = 'assistant',

        /** User represents a user who is responding. */
        User = 'user',

        /** System represents a system who is responding. */
        System = 'system',
    }

    // -------------------------------------------------------------------------

    /**
     * Message represents the role of the sender and the content to process.
     * @public
     *
     * @remarks - Message is used as an input and output parameter.
     */
    export interface Message {
        /** content represents the content to be processed or returned. */
        content: string;

        /** role represents the context of the person providing or responding to the content. */
        role: Role;
    }

    /**
     * Choice represents a choice for the chat call.
     * @public
     *
     * @remarks - Choice is used in the Chat type as part of the chat response.
     */
    export interface Choice {
        /** index represents the index position from the collection of choices. */
        index: number;

        /** message represents one of many possible responses to choose from. */
        message: Message;

        /** status represents if the response was successful or not. */
        status: string;
    }

    /**
     * Chat represents the result for the chat call.
     * @public
     *
     * @remarks - Chat is the response from the Chat API call.
     */
    export interface Chat {
        /** id represents a unique identifier for the response. */
        id: string;

        /** object represent the type of response document. */
        object: string;

        /** created represents the raw unix time of the response. */
        created: number;

        /** model represents the model used for the request. */
        model: Model;

        /** choices represents the collection of choices to choose from. */
        choices: Choice[];

        /** createdDate converts the raw unix time into a JS Date. */
        createdDate(): Date;
    }

    // -------------------------------------------------------------------------

    /**
     * SSEDelta represents content for the sse call.
     * @public
     *
     * @remarks - SSEDelta is used in the ChatSSE type as part of the chat response.
     */
    export interface SSEDelta {
        /** content represents the partial resulting content for a given choice. */
        content: string;
    }

    /**
     * SSEChoice represents a choice for the sse call.
     * @public
     *
     * @remarks - SSEChoice is used in the ChatSSE type as part of the chat response.
     */
    export interface SSEChoice {
        /** index represents the index position from the collection of choices. */
        index: number;

        /** delta represents the partial resulting content for a given choice. */
        delta: SSEDelta;

        /** generated_text represents the final completed chat response. */
        generated_text: string;

        /** logprobs represents the log probabilty of accuracy. */
        logprobs: number;

        /** finish_reason represents the reason the response has finished. */
        finish_reason: string;
    }

    /**
     * ChatSSE represents the result for the sse call.
     * @public
     *
     * @remarks - ChatSSE is the response from the ChatSSE API call.
     */
    export interface ChatSSE {
        /** id represents a unique identifier for the response. */
        id: string;

        /** object represent the type of response document. */
        object: string;

        /** created represents the raw unix time of the response. */
        created: number;

        /** model represents the model used for the request. */
        model: Model;

        /** choices represents the collection of choices to choose from. */
        choices: SSEChoice[];

        /** createdDate converts the raw unix time into a JS Date. */
        createdDate(): Date;
    }

    // -------------------------------------------------------------------------

    /**
     * Client provides access to the chat apis.
     * @public
     *
     * @remarks - Client provides methods to make Chat related client calls.
     */
    export class Client extends client.Client {
        /**
         * Chat generates a response based on a chat conversation.
         * @param {Model} model - model represents the model to use for the request.
         * @param {Message[]} input - input represents the data to process for the request.
         * @param {number} maxTokens - inpmaxTokensut represents the maximum number of words to return.
         * @param {number} temperature - temperature represents the controlling factor of randomness.
         * @returns - A chat respose or error.
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

        /**
         * ChatSSE generates response chunks based on a chat conversation.
         * @param {Model} model - model represents the model to use for the request.
         * @param {Message[]} input - input represents the data to process for the request.
         * @param {number} maxTokens - inpmaxTokensut represents the maximum number of words to return.
         * @param {number} temperature - temperature represents the controlling factor of randomness.
         * @param {(event: ChatSSE | null, err: client.Error | null) => void} onMessage - onMessage represents a function that is called with chat results.
         * @returns - A chat respose or error.
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

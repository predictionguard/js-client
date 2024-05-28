import client from './api_client.js';
import * as sse from 'fetch-sse';

export module chat {
    /** Models represents the set of models that can be used. */
    export enum Model {
        Hermes2ProLlama38B = 'Hermes-2-Pro-Llama-3-8B',
        NousHermesLlama213B = 'Nous-Hermes-Llama-213B',
        Hermes2ProMistral7B = 'Hermes-2-Pro-Mistral-7B',
        NeuralChat7B = 'Neural-Chat-7B',
        Yi34BChat = 'Yi-34B-Chat',
        DeepseekCoder67BInstruct = 'deepseek-coder-6.7b-instruct',
    }

    /** Role represents the set of roles that can be used. */
    export enum Role {
        Assistant = 'assistant',
        User = 'user',
        System = 'system',
    }

    // -------------------------------------------------------------------------

    /** Message represents the role of the sender and the content to process. */
    export interface Message {
        role: Role;
        content: string;
    }

    /** Choice represents a choice for the chat call. */
    export interface Choice {
        index: number;
        message: Message;
        status: string;
    }

    /** Chat represents the result for the chat call. */
    export interface Chat {
        id: string;
        object: string;
        created: number;
        model: Model;
        choices: Choice[];
    }

    // -------------------------------------------------------------------------

    /** SSEDelta represents content for the sse call. */
    export interface SSEDelta {
        content: string;
    }

    /** SSEChoice represents a choice for the sse call.  */
    export interface SSEChoice {
        index: number;
        delta: SSEDelta;
        generated_text: string;
        logprobs: number;
        finish_reason: string;
    }

    /** ChatSSE represents the result for the sse call. */
    export interface ChatSSE {
        id: string;
        object: string;
        created: number;
        Model: Model;
        choices: SSEChoice[];
    }

    // -------------------------------------------------------------------------

    /** Client provides access to the chat apis. */
    export class Client extends client.Client {
        /**
         * Chat generates chat completions based on a conversation history.
         * @param {Model} model - The title of the book.
         * @param {Message[]} input - The author of the book.
         * */
        async Chat(model: Model, input: Message[], maxTokens: number, temperature: number): Promise<[Chat, client.Error | null]> {
            const zero: Chat = {
                id: '',
                object: '',
                created: 0,
                model: Model.NeuralChat7B,
                choices: [],
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

                return [result as Chat, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }

        /** ChatSSE generates chat completions based on a conversation history. */
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

                    onMessage(JSON.parse(event.data) as ChatSSE, err);
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

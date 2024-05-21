import client from '../dist/api_client.js';

export module chat {
    /** Models represents the set of models that can be used. */
    export enum Model {
        MetaLlama38BInstruct = 'Meta-Llama-38B-Instruct',
        NousHermesLlama213B = 'Nous-Hermes-Llama-213B',
        Hermes2ProMistral7B = 'Hermes-2-Pro-Mistral-7B',
        NeuralChat7B = 'Neural-Chat-7B',
        Yi34BChat = 'Yi-34B-Chat',
        DeepseekCoder67BInstruct = 'deepseek-coder-6.7b-instruct',
    }

    /** Role represents the set of roles that can be used. */
    export enum Role {
        User = 'user',
        Assistant = 'assistant',
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

    /** Client provides access to the chat apis. */
    export class Client extends client.Client {
        /** chat generates chat completions based on a conversation history. */
        async Chat(model: Model, maxTokens: number, temperature: number, messages: Message[]): Promise<[Chat, client.Error | null]> {
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
                    messages: messages,
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
    }
}

export default chat;
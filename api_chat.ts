import client from './api_client.ts';

export module chat {
    /** Message represents the role of the sender and the content to process. */
    export interface Message {
        role: string;
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
        model: string;
        choices: Choice[];
    }

    // -------------------------------------------------------------------------

    export class Client extends client.Client {
        /** Do generates chat completions based on a conversation history. */
        async Do(model: string, maxTokens: number, temperature: number, messages: Message[]): Promise<[Chat, client.Error | null]> {
            const zero: Chat = {
                id: '',
                object: '',
                created: 0,
                model: '',
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

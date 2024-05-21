import client from './client.ts';

export module chat {
    export interface Message {
        role: string;
        content: string;
    }

    export interface Choice {
        index: number;
        message: Message;
        status: string;
    }

    export interface Chat {
        id: string;
        object: string;
        created: number;
        model: string;
        choices: Choice[];
    }

    // -------------------------------------------------------------------------

    export class Client extends client.Client {
        async Chat(model: string, maxTokens: number, temperature: number, messages: Message[]): Promise<[Chat, client.Error | null]> {
            const zeroChat: Chat = {
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

                const [chat, err] = await this.DoPost('chat/completions', body);
                if (err != null) {
                    return [zeroChat, err];
                }

                return [chat as Chat, null];
            } catch (e) {
                return [zeroChat, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default chat;
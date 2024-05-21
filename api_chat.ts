import client from './client.js';

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

    export interface Response {
        id: string;
        object: string;
        created: number;
        model: string;
        choices: Choice[];
    }

    // -------------------------------------------------------------------------

    export class Client extends client.Client {
        async Chat(model: string, maxTokens: number, temperature: number, messages: Message[]): Promise<[Response, client.Error|null]> {
            const zeroChat: Response = {
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

                const [chat, err] = await this.DoPost('chat/completions', body);
                if (err != null) {
                    return [zeroChat, err];
                }

                return [chat as Response, null];
            } catch (e) {
                return [zeroChat, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default chat;

import client from './api_client.ts';
import api from './api.ts';

export module completion {
    /** Choice represents a choice for the completion call. */
    export interface Choice {
        text: string;
        index: number;
        status: string;
        model: api.Model;
    }

    /** Completion represents the result for the completion call. */
    export interface Completion {
        id: string;
        object: string;
        created: number;
        choices: Choice[];
    }

    // -------------------------------------------------------------------------

    /** Client provides access to the completion api. */
    export class Client extends client.Client {
        /** Do retrieve text completions based on the provided input. */
        async Do(model: api.Model, maxTokens: number, temperature: number, prompt: string): Promise<[Completion, client.Error | null]> {
            const zero: Completion = {
                id: '',
                object: '',
                created: 0,
                choices: [],
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

                return [result as Completion, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default completion;

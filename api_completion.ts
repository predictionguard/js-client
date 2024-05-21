import client from './api_client.ts';

export module completion {
    export class Client extends client.Client {
        async Do(model: string, maxTokens: number, temperature: number, prompt: string) {
            try {
                const body = {
                    model: model,
                    max_tokens: maxTokens,
                    temperature: temperature,
                    prompt: prompt,
                };

                return this.RawDoPost('completions', body);
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default completion;

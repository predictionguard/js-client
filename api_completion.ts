import client from './client.ts';

export module completion {
    // -------------------------------------------------------------------------

    export class Client extends client.Client {
        async Completions(model: string, maxTokens: number, temperature: number, prompt: string) {
            try {
                const body = {
                    model: model,
                    max_tokens: maxTokens,
                    temperature: temperature,
                    prompt: prompt,
                };

                return this.DoPost('completions', body);
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default completion;

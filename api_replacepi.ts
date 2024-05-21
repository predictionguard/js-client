import client from './api_client.ts';

export module replacepi {
    export class Client extends client.Client {
        async Do(prompt: string, replaceMethod: string) {
            try {
                const body = {
                    prompt: prompt,
                    replace: true,
                    replace_method: replaceMethod,
                };

                return this.RawDoPost('PII', body);
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default replacepi;

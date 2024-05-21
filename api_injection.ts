import client from './api_client.ts';

export module injection {
    export class Client extends client.Client {
        async Do(prompt: string) {
            try {
                const body = {
                    prompt: prompt,
                    detect: true,
                };

                return this.RawDoPost('injection', body);
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default injection;

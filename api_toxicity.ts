import client from './api_client.ts';

export module toxicity {
    export class Client extends client.Client {
        async Do(text: string) {
            try {
                const body = {
                    text: text,
                };

                return this.RawDoPost('toxicity', body);
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default toxicity;

import client from './api_client.ts';

export module factuality {
    export class Client extends client.Client {
        async Do(reference: string, text: string) {
            try {
                const body = {
                    reference: reference,
                    text: text,
                };

                return this.RawDoPost('factuality', body);
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default factuality;

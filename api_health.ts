import client from './api_client.ts';

export module health {
    export class Client extends client.Client {
        async Do() {
            try {
                return this.RawDoGet('');
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default health;

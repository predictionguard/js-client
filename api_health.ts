import client from './api_client.ts';

export module health {
    export class Client extends client.Client {
        async Do(): Promise<[string, client.Error | null]> {
            const zero: string = '';

            try {
                const [result, err] = await this.RawDoGet('');
                if (err != null) {
                    return [zero, err];
                }

                return [result as string, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default health;

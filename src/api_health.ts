import client from '../dist/api_client.js';

export module health {
    /** Client provides access to the health apis. */
    export class Client extends client.Client {
        /** HealthCheck validates the PG API Service is available. */
        async HealthCheck(): Promise<[string, client.Error | null]> {
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

import client from './api_client.js';

/** Module health provides support for the health check endpoints. */
export module health {
    /** Client provides APIs to access the health check endpoints. */
    export class Client extends client.Client {
        /** HealthCheck validates the PG API Service is available.
         *
         * @example
         * ```
         * import * as pg from 'predictionguard';
         *
         * const client = new pg.health.Client('https://api.predictionguard.com', process.env.PGKEY);
         *
         * async function HealthCheck() {
         *     var [result, err] = await client.HealthCheck();
         *     if (err != null) {
         *         console.log('ERROR:' + err.error);
         *         return;
         *     }
         *
         *     console.log(result);
         * }
         *
         * HealthCheck();
         * ```
         *
         * @returns - A Promise with a string and a client.Error object if
         * the error is not null.
         */
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

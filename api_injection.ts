import client from './api_client.ts';

export module injection {
    /** Check represents the result for the injection call. */
    export interface Check {
        probability: number;
        index: number;
        status: string;
    }

    /** Injection represents the result for the injection call. */
    export interface Injection {
        id: string;
        object: string;
        created: number;
        checks: Check[];
    }

    // -------------------------------------------------------------------------

    export class Client extends client.Client {
        /** Do detects potential prompt injection attacks in a given prompt. */
        async Do(prompt: string): Promise<[Injection, client.Error | null]> {
            const zero: Injection = {
                id: '',
                object: '',
                created: 0,
                checks: [],
            };

            try {
                const body = {
                    prompt: prompt,
                    detect: true,
                };

                const [result, err] = await this.RawDoPost('injection', body);
                if (err != null) {
                    return [zero, err];
                }

                return [result as Injection, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default injection;

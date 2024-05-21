import client from '../dist/api_client.js';

export module factuality {
    /** Check represents the result for the factuality call. */
    export interface Check {
        score: number;
        index: number;
        status: string;
    }

    /** Factuality represents the result for the factuality call. */
    export interface Factuality {
        id: string;
        object: string;
        created: number;
        checks: Check[];
    }

    // -------------------------------------------------------------------------

    /** Client provides access to the factuality api. */
    export class Client extends client.Client {
        /** Factuality checks the factuality of a given text compared to a reference. */
        async Factuality(reference: string, text: string): Promise<[Factuality, client.Error | null]> {
            const zero: Factuality = {
                id: '',
                object: '',
                created: 0,
                checks: [],
            };

            try {
                const body = {
                    reference: reference,
                    text: text,
                };

                const [result, err] = await this.RawDoPost('factuality', body);
                if (err != null) {
                    return [zero, err];
                }

                return [result as Factuality, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default factuality;

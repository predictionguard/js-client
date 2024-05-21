import client from '../dist/api_client.js';

export module toxicity {
    /** Check represents the result for the toxicity call. */
    export interface Check {
        score: number;
        index: number;
        status: string;
    }

    /** Toxicity represents the result for the toxicity call. */
    export interface Toxicity {
        id: string;
        object: string;
        created: number;
        checks: Check[];
    }

    // -------------------------------------------------------------------------

    /** Client provides access to the toxicity api. */
    export class Client extends client.Client {
        /** Toxicity checks the toxicity of a given text. */
        async Toxicity(text: string): Promise<[Toxicity, client.Error | null]> {
            const zero: Toxicity = {
                id: '',
                object: '',
                created: 0,
                checks: [],
            };

            try {
                const body = {
                    text: text,
                };

                const [result, err] = await this.RawDoPost('toxicity', body);
                if (err != null) {
                    return [zero, err];
                }

                return [result as Toxicity, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default toxicity;

import client from './api_client.ts';

export module replacepi {
    /** Check represents the result for the pii call. */
    export interface Check {
        new_prompt: string;
        index: number;
        status: string;
    }

    /** ReplacePI represents the result for the pii call. */
    export interface ReplacePI {
        id: string;
        object: string;
        created: number;
        checks: Check[];
    }

    // -------------------------------------------------------------------------

    export class Client extends client.Client {
        /** ReplacePI replaces personal information such as names, SSNs, and
         * emails in a given text. */
        async Do(prompt: string, replaceMethod: string): Promise<[ReplacePI, client.Error | null]> {
            const zero: ReplacePI = {
                id: '',
                object: '',
                created: 0,
                checks: [],
            };

            try {
                const body = {
                    prompt: prompt,
                    replace: true,
                    replace_method: replaceMethod,
                };

                const [result, err] = await this.RawDoPost('PII', body);
                if (err != null) {
                    return [zero, err];
                }

                return [result as ReplacePI, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default replacepi;

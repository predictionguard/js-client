import client from './api_client.js';

export module replacepi {
    /** ReplaceMethod represents the set of replace methods that can be used. */
    export enum ReplaceMethod {
        Random = 'random',
        Fake = 'fake',
        Category = 'category',
        Mask = 'mask',
    }

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

    /** Client provides access to the replacepi api. */
    export class Client extends client.Client {
        /** ReplacePI replaces personal information such as names, SSNs, and
         * emails in a given text. */
        async ReplacePI(prompt: string, replaceMethod: ReplaceMethod): Promise<[ReplacePI, client.Error | null]> {
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

import client from './api_client.js';

/** Module replacepi provides support for the PII endpoints. */
export module replacepi {
    /** ReplaceMethod represents the set of replace methods that can be used. */
    export enum ReplaceMethod {
        Random = 'random',
        Fake = 'fake',
        Category = 'category',
        Mask = 'mask',
    }

    // -------------------------------------------------------------------------

    /** Check represents an object that contains a check choice. */
    export interface Check {
        /** index represents the index position in the collection for
         * this checks. */
        index: number;

        /** new_prompt represents the text with replaced personal information. */
        new_prompt: string;

        /** status represents the status for this check. */
        status: string;
    }

    /** ReplacePI represents an object that contains the result for the
     * replacepi call. */
    export interface ReplacePI {
        /** id represents a unique identifier for the result. */
        id: string;

        /** object represent the type of the result document. */
        object: string;

        /** created represents the unix timestamp for when the request was
         * received. */
        created: number;

        /** checks represents the collection of checks to choose from. */
        checks: Check[];

        /** createdDate converts the created unix timestamp into a JS Date. */
        createdDate(): Date;
    }

    // -------------------------------------------------------------------------

    /** Client provides APIs to access the replacepi endpoints. */
    export class Client extends client.Client {
        /** ReplacePI replaces personal information such as names, SSNs, and
         * emails in a given text.
         *
         * @example
         * ```
         * import * as pg from 'predictionguard';
         *
         * const client = new pg.replacepi.Client('https://api.predictionguard.com', process.env.PGKEY);
         *
         * async function ReplacePI() {
         *     const replaceMethod = pg.replacepi.ReplaceMethod.Mask;
         *     const prompt = `My email is bill@ardanlabs.com and my number is 954-123-4567.`;
         *
         *     var [result, err] = await client.ReplacePI(replaceMethod, prompt);
         *     if (err != null) {
         *         console.log('ERROR:' + err.error);
         *         return;
         *     }
         *
         *     console.log('RESULT:' + result.checks[0].new_prompt);
         * }
         *
         * ReplacePI();
         * ```
         *
         * @param {ReplaceMethod} replaceMethod - replaceMethod represents the
         * method to use for replacing personal information.
         * @param {string} prompt - prompt represents the text to detect
         * injection attacks against.
         *
         * @returns - A Promise with a ReplacePI object and a client.Error
         * object if the error is not null.
         * */
        async ReplacePI(replaceMethod: ReplaceMethod, prompt: string): Promise<[ReplacePI, client.Error | null]> {
            const zero: ReplacePI = {
                id: '',
                object: '',
                created: 0,
                checks: [],
                createdDate: function () {
                    return new Date(0);
                },
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

                const replacePI = result as ReplacePI;
                replacePI.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                return [replacePI, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default replacepi;

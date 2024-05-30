import client from './api_client.js';

/** Module toxicity provides support for the toxicity endpoints. */
export module toxicity {
    /** Check represents an object that contains a check choice. */
    export interface Check {
        /** index represents the index position in the collection for
         * this checks. */
        index: number;

        /** score represents the score for the provided text. */
        score: number;

        /** status represents the status for this check. */
        status: string;
    }

    /** Toxicity represents an object that contains the result for the
     * toxicity call. */
    export interface Toxicity {
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

    /** Client provides APIs to access the toxicity endpoints. */
    export class Client extends client.Client {
        /** Toxicity checks the toxicity of a given text.
         *
         * @example
         * ```
         * import * as pg from 'predictionguard';
         *
         * const client = new pg.toxicity.Client('https://api.predictionguard.com', process.env.PGKEY);
         *
         * async function Toxicity() {
         *     const text = `Every flight I have is late and I am very angry. I want to
         *     hurt someone.`;
         *
         *     var [result, err] = await client.Toxicity(text);
         *     if (err != null) {
         *         console.log('ERROR:' + err.error);
         *         return;
         *     }
         *
         *     console.log('RESULT:' + result.checks[0].score);
         * }
         *
         * Toxicity();
         * ```
         *
         * @param {string} text - text represents the text to be scored
         * for toxicity.
         *
         * @returns - A Promise with a Toxicity object and a client.Error
         * object if the error is not null.
         */
        async Toxicity(text: string): Promise<[Toxicity, client.Error | null]> {
            const zero: Toxicity = {
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
                    text: text,
                };

                const [result, err] = await this.RawDoPost('toxicity', body);
                if (err != null) {
                    return [zero, err];
                }

                const toxicity = result as Toxicity;
                toxicity.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                return [toxicity, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default toxicity;

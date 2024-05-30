import client from './api_client.js';

/** Module factuality provides support for the factuality endpoints. */
export module factuality {
    /** Check represents an object that contains a check choice. */
    export interface Check {
        /** index represents the index position in the collection for
         * this checks. */
        index: number;

        /** score represents the score for this check. */
        score: number;

        /** status represents the status for this check. */
        status: string;
    }

    /** Factuality represents an object that contains the result for the
     * factuality call. */
    export interface Factuality {
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

    /** Client provides APIs to access the factuality endpoints. */
    export class Client extends client.Client {
        /** Factuality checks the factuality of a given text compared to a reference.
         *
         * @example
         * ```
         * import * as pg from 'predictionguard';
         *
         * const client = new pg.factuality.Client('https://api.predictionguard.com', process.env.PGKEY);
         *
         * async function Factuality() {
         *     const fact = `The President shall receive in full for his services during
         *     the term for which he shall have been elected compensation in the aggregate
         *     amount of 400,000 a year, to be paid monthly, and in addition an expense
         *     allowance of 50,000 to assist in defraying expenses relating to or resulting
         *     from the discharge of his official duties. Any unused amount of such expense
         *     allowance shall revert to the Treasury pursuant to section 1552 of title 31,
         *     United States Code. No amount of such expense allowance shall be included in
         *     the gross income of the President. He shall be entitled also to the use of
         *     the furniture and other effects belonging to the United States and kept in
         *     the Executive Residence at the White House.`;
         *
         *     const text = `The president of the united states can take a salary of one
         *     million dollars`;
         *
         *     var [result, err] = await client.Factuality(fact, text);
         *     if (err != null) {
         *         console.log('ERROR:' + err.error);
         *         return;
         *     }
         *
         *     console.log('RESULT:' + JSON.stringify(result.checks[0]));
         * }
         *
         * Factuality();
         * ```
         *
         * @param {string} reference - reference represents the reference text
         * for comparison.
         * @param {string} text - text represents the text to be checked
         * for factuality.
         *
         * @returns - A Promise with a Factuality object and a client.Error
         * object if the error is not null.
         */
        async Factuality(reference: string, text: string): Promise<[Factuality, client.Error | null]> {
            const zero: Factuality = {
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
                    reference: reference,
                    text: text,
                };

                const [result, err] = await this.RawDoPost('factuality', body);
                if (err != null) {
                    return [zero, err];
                }

                const factuality = result as Factuality;
                factuality.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                return [factuality, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default factuality;

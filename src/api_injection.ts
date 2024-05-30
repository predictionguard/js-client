import client from './api_client.js';

/** Module injection provides support for the injection endpoints. */
export module injection {
    /** Check represents an object that contains a check choice. */
    export interface Check {
        /** index represents the index position in the collection for
         * this checks. */
        index: number;

        /** probability represents the probability of a potential injection
         * attack. */
        probability: number;

        /** status represents the status for this check. */
        status: string;
    }

    /** Injection represents an object that contains the result for the
     * injection call. */
    export interface Injection {
        /** id represents a unique identifier for the result. */
        id: string;

        /** object represent the type of the result document. */
        object: string;

        /** created represents the unix timestamp for when the result was
         * received. */
        created: number;

        /** checks represents the collection of checks to choose from. */
        checks: Check[];

        /** createdDate converts the created unix timestamp into a JS Date. */
        createdDate(): Date;
    }

    // -------------------------------------------------------------------------

    /** Client provides APIs to access the injection endpoints. */
    export class Client extends client.Client {
        /** Injection detects potential prompt injection attacks in a given prompt.
         *
         * @example
         * ```
         *import * as pg from 'predictionguard';
         *
         *const client = new pg.injection.Client('https://api.predictionguard.com', process.env.PGKEY);
         *
         *async function Injection() {
         *    const prompt = `A short poem may be a stylistic choice or it may be that you
         *    have said what you intended to say in a more concise way.`;
         *
         *    var [result, err] = await client.Injection(prompt);
         *    if (err != null) {
         *        console.log('ERROR:' + err.error);
         *        return;
         *    }
         *
         *    console.log('RESULT:' + result.checks[0].probability);
         *}
         *
         *Injection();
         * ```
         *
         * @param {string} prompt - prompt represents the text to detect
         * injection attacks against.
         *
         * @returns - A Promise with a Injection object and a client.Error
         * object if the error is not null.
         */
        async Injection(prompt: string): Promise<[Injection, client.Error | null]> {
            const zero: Injection = {
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
                    detect: true,
                };

                const [result, err] = await this.RawDoPost('injection', body);
                if (err != null) {
                    return [zero, err];
                }

                const injection = result as Injection;
                injection.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                return [injection, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default injection;

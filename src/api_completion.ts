import client from './api_client.js';

/** Module completion provides support for the completion endpoints. */
export module completion {
    /** Model represents the set of models that can be used. */
    export enum Model {
        Hermes2ProLlama38B = 'Hermes-2-Pro-Llama-3-8B',
        NousHermesLlama213B = 'Nous-Hermes-Llama-213B',
        Hermes2ProMistral7B = 'Hermes-2-Pro-Mistral-7B',
        NeuralChat7B = 'Neural-Chat-7B',
        Yi34BChat = 'Yi-34B-Chat',
        DeepseekCoder67BInstruct = 'deepseek-coder-6.7b-instruct',
    }

    // -------------------------------------------------------------------------

    /** Choice represents an object that contains a result choice. */
    export interface Choice {
        /** index represents the index position in the collection for
         * this choice. */
        index: number;

        /** model represents the model used for generating the result for
         * this choice. */
        model: Model;

        /** status represents if the response for this choice was successful
         * or not. */
        status: string;

        /** text represents the generated text for this choice. */
        text: string;
    }

    /** Completion represents an object that contains the result for the
     * completion call. */
    export interface Completion {
        /** id represents a unique identifier for the result. */
        id: string;

        /** object represent the type of the result document. */
        object: string;

        /** created represents the unix timestamp for when the request was
         * received. */
        created: number;

        /** choices represents the collection of choices to choose from. */
        choices: Choice[];

        /** createdDate converts the created unix timestamp into a JS Date. */
        createdDate(): Date;
    }

    // -------------------------------------------------------------------------

    /** Client provides APIs to access the completion endpoints. */
    export class Client extends client.Client {
        /** Chat generates text completions based on the provided input.
         *
         * @example
         * ```
         * import * as pg from 'predictionguard';
         *
         * const client = new pg.completion.Client('https://api.predictionguard.com', process.env.PGKEY);
         *
         * async function Completions() {
         *     const model = pg.completion.Model.NeuralChat7B;
         *     const maxTokens = 1000;
         *     const temperature = 1.1;
         *     const prompt = 'Will I lose my hair';
         *
         *     var [result, err] = await client.Completion(model, maxTokens, temperature, prompt);
         *     if (err != null) {
         *         console.log('ERROR:' + err.error);
         *         return;
         *     }
         *
         *     console.log('RESULT:' + result.choices[0].text);
         * }
         *
         * Completions();
         * ```
         *
         * @param {Model} model - model represents the model to use for the
         * request.
         * @param {number} maxTokens - maxTokens represents the maximum number
         * of tokens in the generated chat.
         * @param {number} temperature - temperature represents the parameter
         * for controlling randomness in generated chat.
         * @param {number} temperature - prompt represents the chat input.
         *
         * @returns - A Promise with a Completion object and a client.Error
         * object if the error is not null.
         */
        async Completion(model: Model, maxTokens: number, temperature: number, prompt: string): Promise<[Completion, client.Error | null]> {
            const zero: Completion = {
                id: '',
                object: '',
                created: 0,
                choices: [],
                createdDate: function () {
                    return new Date(0);
                },
            };

            try {
                const body = {
                    model: model,
                    max_tokens: maxTokens,
                    temperature: temperature,
                    prompt: prompt,
                };

                const [result, err] = await this.RawDoPost('completions', body);
                if (err != null) {
                    return [zero, err];
                }

                const chat = result as Completion;
                chat.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                return [chat, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default completion;

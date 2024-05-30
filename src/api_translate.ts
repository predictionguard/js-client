import client from './api_client.js';

/** Module translate provides support for the translate endpoints. */
export module translate {
    /** Languages represents the set of languages that can be used. */
    export enum Language {
        Afrikanns = 'afr',
        Amharic = 'amh',
        Arabic = 'ara',
        Armenian = 'hye',
        Azerbaijan = 'aze',
        Basque = 'eus',
        Belarusian = 'bel',
        Bengali = 'ben',
        Bosnian = 'bos',
        Catalan = 'cat',
        Chechen = 'che',
        Cherokee = 'chr',
        Chinese = 'zho',
        Croatian = 'hrv',
        Czech = 'ces',
        Danish = 'dan',
        Dutch = 'nld',
        English = 'eng',
        Estonian = 'est',
        Fijian = 'fij',
        Filipino = 'fil',
        Finnish = 'fin',
        French = 'fra',
        Galician = 'glg',
        Georgian = 'kat',
        German = 'deu',
        Greek = 'ell',
        Gujarati = 'guj',
        Haitian = 'hat',
        Hebrew = 'heb',
        Hindi = 'hin',
        Hungarian = 'hun',
        Icelandic = 'isl',
        Indonesian = 'ind',
        Irish = 'gle',
        Italian = 'ita',
        Japanese = 'jpn',
        Kannada = 'kan',
        Kazakh = 'kaz',
        Korean = 'kor',
        Latvian = 'lav',
        Lithuanian = 'lit',
        Macedonian = 'mkd',
        Malay1 = 'msa',
        Malay2 = 'zlm',
        Malayalam = 'mal',
        Maltese = 'mlt',
        Marathi = 'mar',
        Nepali = 'nep',
        Norwegian = 'nor',
        Persian = 'fas',
        Polish = 'pol',
        Portuguese = 'por',
        Romanian = 'ron',
        Russian = 'rus',
        Samoan = 'smo',
        Serbian = 'srp',
        Slovak = 'slk',
        Slovenian = 'slv',
        Slavonic = 'chu',
        Spanish = 'spa',
        Swahili = 'swh',
        Swedish = 'swe',
        Tamil = 'tam',
        Telugu = 'tel',
        Thai = 'tha',
        Turkish = 'tur',
        Ukrainian = 'ukr',
        Urdu = 'urd',
        Welsh = 'cym',
        Vietnamese = 'vie',
    }

    // -------------------------------------------------------------------------

    /** Translation represents an object that contains a translation choice. */
    export interface Translation {
        /** score represents the quality score for this translation. */
        score: number;

        /** translation represents the translation. */
        translation: string;

        /** model represents the model that was used for this translation. */
        model: string;

        /** status represents the status of using the model for this translation. */
        status: string;
    }

    /** Translate represents an object that contains the result for the
     * translate call. */
    export interface Translate {
        /** id represents a unique identifier for the result. */
        id: string;

        /** object represent the type of the result document. */
        object: string;

        /** created represents the unix timestamp for when the request was
         * received. */
        created: number;

        /** best_translation represents the best translation of the input text. */
        best_translation: string;

        /** best_translation_model represents the model used for the best
         * translation. */
        best_translation_model: string;

        /** best_score represents the best score for the best translation. */
        best_score: number;

        /** translations represents the collection of translations to choose from. */
        translations: Translation[];

        /** createdDate converts the created unix timestamp into a JS Date. */
        createdDate(): Date;
    }

    // -------------------------------------------------------------------------

    /** Client provides APIs to access the translate endpoints. */
    export class Client extends client.Client {
        /** Translate converts text from one language to another.
         *
         * @example
         * ```
         * import * as pg from 'predictionguard';
         *
         * const client = new pg.translate.Client('https://api.predictionguard.com', process.env.PGKEY);
         *
         * async function Translate() {
         *     const sourceLang = pg.translate.Language.English;
         *     const targetLang = pg.translate.Language.Spanish;
         *     const text = `The rain in Spain stays mainly in the plain`;
         *
         *     var [result, err] = await client.Translate(text, sourceLang, targetLang);
         *     if (err != null) {
         *         console.log('ERROR:' + err.error);
         *         return;
         *     }
         *
         *     console.log('RESULT:' + result.best_translation);
         * }
         *
         * Translate();
         * ```
         *
         * @param {string} text - text represents the text to be translated.
         * @param {Language} sourceLang - sourceLang represents the source
         * language of the text.
         * @param {Language} targetLang - targetLang represents the target
         * language of the text.
         *
         * @returns - A Promise with a Translate object and a client.Error
         * object if the error is not null.
         */
        async Translate(text: string, sourceLang: Language, targetLang: Language): Promise<[Translate, client.Error | null]> {
            const zero: Translate = {
                id: '',
                object: '',
                created: 0,
                best_translation: '',
                best_translation_model: '',
                best_score: 0,
                translations: [],
                createdDate: function () {
                    return new Date(0);
                },
            };

            try {
                const body = {
                    text: text,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                };

                const [result, err] = await this.RawDoPost('translate', body);
                if (err != null) {
                    return [zero, err];
                }

                const translate = result as Translate;
                translate.createdDate = function () {
                    return new Date(this.created * 1000);
                };

                return [translate, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default translate;

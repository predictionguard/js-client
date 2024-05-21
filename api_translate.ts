import client from './api_client.ts';
import api from './api.ts';

export module translate {
    /** Translation represents the result for the translate call. */
    export interface Translation {
        score: number;
        translation: string;
        model: string;
        status: string;
    }

    /** Translate represents the result for the translate call. */
    export interface Translate {
        id: string;
        object: string;
        created: number;
        best_translation: string;
        best_translation_model: string;
        best_score: number;
        translations: Translation[];
    }

    // -------------------------------------------------------------------------

    /** Client provides access to the translate api. */
    export class Client extends client.Client {
        /** Translate converts text from one language to another. */
        async Do(text: string, sourceLang: api.Language, targetLang: api.Language): Promise<[Translate, client.Error | null]> {
            const zero: Translate = {
                id: '',
                object: '',
                created: 0,
                best_translation: '',
                best_translation_model: '',
                best_score: 0,
                translations: [],
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

                return [result as Translate, null];
            } catch (e) {
                return [zero, {error: JSON.stringify(e)}];
            }
        }
    }
}

export default translate;

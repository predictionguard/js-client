import client from './api_client.ts';

export module translate {
    export class Client extends client.Client {
        async Do(text: string, sourceLang: string, targetLang: string) {
            try {
                const body = {
                    text: text,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                };

                return this.RawDoPost('translate', body);
            } catch (e) {
                return [null, e];
            }
        }
    }
}

export default translate;

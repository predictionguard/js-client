import chat from './api_chat.ts';
import completion from './api_completion.ts';
import factuality from './api_factuality.ts';
import health from './api_health.ts';
import injection from './api_injection.ts';
import replacepi from './api_replacepi.ts';
import toxicity from './api_toxicity.ts';
import translate from './api_translate.ts';

export module api {
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

    /** Models represents the set of models that can be used. */
    export enum Model {
        MetaLlama38BInstruct = 'Meta-Llama-38B-Instruct',
        NousHermesLlama213B = 'Nous-Hermes-Llama-213B',
        Hermes2ProMistral7B = 'Hermes-2-Pro-Mistral-7B',
        NeuralChat7B = 'Neural-Chat-7B',
        Yi34BChat = 'Yi-34B-Chat',
        DeepseekCoder67BInstruct = 'deepseek-coder-6.7b-instruct',
    }

    /** ReplaceMethod represents the set of replace methods that can be used. */
    export enum ReplaceMethod {
        Random = 'random',
        Fake = 'fake',
        Category = 'category',
        Mask = 'mask',
    }

    /** Role represents the set of roles that can be used. */
    export enum Role {
        User = 'user',
        Assistant = 'assistant',
    }

    // -------------------------------------------------------------------------

    /** Client provides access to the complete set of available apis. */
    export class Client {
        public Chat;
        public Completion;
        public Factuality;
        public HealthCheck;
        public Injection;
        public ReplacePI;
        public Toxicity;
        public Translate;

        // ---------------------------------------------------------------------

        constructor(url: string, apiKey: string) {
            this.Chat = new chat.Client(url, apiKey);
            this.Completion = new completion.Client(url, apiKey);
            this.Factuality = new factuality.Client(url, apiKey);
            this.HealthCheck = new health.Client(url, apiKey);
            this.Injection = new injection.Client(url, apiKey);
            this.ReplacePI = new replacepi.Client(url, apiKey);
            this.Toxicity = new toxicity.Client(url, apiKey);
            this.Translate = new translate.Client(url, apiKey);
        }
    }
}

export default api;

import client from '../dist/api_client.js';
export declare namespace translate {
    /** Languages represents the set of languages that can be used. */
    enum Language {
        Afrikanns = "afr",
        Amharic = "amh",
        Arabic = "ara",
        Armenian = "hye",
        Azerbaijan = "aze",
        Basque = "eus",
        Belarusian = "bel",
        Bengali = "ben",
        Bosnian = "bos",
        Catalan = "cat",
        Chechen = "che",
        Cherokee = "chr",
        Chinese = "zho",
        Croatian = "hrv",
        Czech = "ces",
        Danish = "dan",
        Dutch = "nld",
        English = "eng",
        Estonian = "est",
        Fijian = "fij",
        Filipino = "fil",
        Finnish = "fin",
        French = "fra",
        Galician = "glg",
        Georgian = "kat",
        German = "deu",
        Greek = "ell",
        Gujarati = "guj",
        Haitian = "hat",
        Hebrew = "heb",
        Hindi = "hin",
        Hungarian = "hun",
        Icelandic = "isl",
        Indonesian = "ind",
        Irish = "gle",
        Italian = "ita",
        Japanese = "jpn",
        Kannada = "kan",
        Kazakh = "kaz",
        Korean = "kor",
        Latvian = "lav",
        Lithuanian = "lit",
        Macedonian = "mkd",
        Malay1 = "msa",
        Malay2 = "zlm",
        Malayalam = "mal",
        Maltese = "mlt",
        Marathi = "mar",
        Nepali = "nep",
        Norwegian = "nor",
        Persian = "fas",
        Polish = "pol",
        Portuguese = "por",
        Romanian = "ron",
        Russian = "rus",
        Samoan = "smo",
        Serbian = "srp",
        Slovak = "slk",
        Slovenian = "slv",
        Slavonic = "chu",
        Spanish = "spa",
        Swahili = "swh",
        Swedish = "swe",
        Tamil = "tam",
        Telugu = "tel",
        Thai = "tha",
        Turkish = "tur",
        Ukrainian = "ukr",
        Urdu = "urd",
        Welsh = "cym",
        Vietnamese = "vie"
    }
    /** Translation represents the result for the translate call. */
    interface Translation {
        score: number;
        translation: string;
        model: string;
        status: string;
    }
    /** Translate represents the result for the translate call. */
    interface Translate {
        id: string;
        object: string;
        created: number;
        best_translation: string;
        best_translation_model: string;
        best_score: number;
        translations: Translation[];
    }
    /** Client provides access to the translate api. */
    class Client extends client.Client {
        /** Translate converts text from one language to another. */
        Translate(text: string, sourceLang: Language, targetLang: Language): Promise<[Translate, client.Error | null]>;
    }
}
export default translate;
//# sourceMappingURL=api_translate.d.ts.map
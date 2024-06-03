/** Error represents an error that can be returned from the API service. */
export interface Error {
    /** error represents an error message. */
    error: string;
}

// -----------------------------------------------------------------------------

/** Models represents the set of models that can be used. */
export enum Models {
    Hermes2ProLlama38B = 'Hermes-2-Pro-Llama-3-8B',
    NousHermesLlama213B = 'Nous-Hermes-Llama-213B',
    Hermes2ProMistral7B = 'Hermes-2-Pro-Mistral-7B',
    Llava157BHF = 'llava-1.5-7b-hf',
    NeuralChat7B = 'Neural-Chat-7B',
    Yi34BChat = 'Yi-34B-Chat',
    DeepseekCoder67BInstruct = 'deepseek-coder-6.7b-instruct',
}

/** Roles represents the set of roles that a sender can represent themselves
 * as. */
export enum Roles {
    Assistant = 'assistant',
    User = 'user',
    System = 'system',
}

/** ReplaceMethods represents the set of replace methods that can be used. */
export enum ReplaceMethods {
    Random = 'random',
    Fake = 'fake',
    Category = 'category',
    Mask = 'mask',
}

/** Languages represents the set of languages that can be used. */
export enum Languages {
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

// -----------------------------------------------------------------------------

/** Base64Encoder defines a method that can read a data source and returns a
 * base64 encoded string. */
export interface Base64Encoder {
    EncodeBase64(): Promise<[string, Error | null]>;
}

// -----------------------------------------------------------------------------

/** ChatInput represents a role and content related to a chat. */
export interface ChatInput {
    role: Roles;
    content: string;
}

/** ChatMessage represents an object that contains the content and a role. It
 * can be used for input and returned as part of the response. */
export interface ChatMessage {
    /** content represents the content of the message. */
    content: string;

    /** role represents the role of the sender (user or assistant). */
    role: Roles;

    /** output represents the output for this message. */
    output: string;
}

/** ChatChoice represents an object that contains a result choice. */
export interface ChatChoice {
    /** index represents the index position in the collection for
     * this choice. */
    index: number;

    /** message represents the message response for this choice. */
    message: ChatMessage;

    /** status represents if the response for this choice was successful
     * or not. */
    status: string;
}

/** Chat represents an object that contains the result for the chat call. */
export interface Chat {
    /** id represents a unique identifier for the result. */
    id: string;

    /** object represent the type of the result document. */
    object: string;

    /** created represents the unix timestamp for when the request was
     * received. */
    created: number;

    /** model represents the model used for generating the result. */
    model: Models;

    /** choices represents the collection of choices to choose from. */
    choices: ChatChoice[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** ChatSSEDelta represents an object that contains the content. */
export interface ChatSSEDelta {
    /** content represents the partial content response for a choice. */
    content: string;
}

/** ChatSSEChoice represents an object that contains a result choice. */
export interface ChatSSEChoice {
    /** index represents the index position in the collection for
     * this choice. */
    index: number;

    /** delta represents the partial content for this choice. */
    delta: ChatSSEDelta;

    /** generated_text represents the final completed chat response which
     * is provided when this is the last choice. */
    generated_text: string;

    /** logprobs represents the log probabilty of accuracy for this choice. */
    logprobs: number;

    /** finish_reason represents the reason the response has finished
     * which is provided when this is the last choice. */
    finish_reason: string;
}

/** ChatSSE represents an object that contains the result for the chatSSE
 * call. */
export interface ChatSSE {
    /** id represents a unique identifier for the result. */
    id: string;

    /** object represent the type of the result document. */
    object: string;

    /** created represents the unix timestamp for when the request was
     * received. */
    created: number;

    /** model represents the model used for generating the result. */
    model: Models;

    /** choices represents the collection of choices to choose from. */
    choices: ChatSSEChoice[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** ChatVisionMessage represents content for the vision call. */
export interface ChatVisionMessage {
    /** role represents the role of the sender (user or assistant). */
    role: Roles;

    /** content represents the response for this message. */
    content: string;

    /** output represents the output for this message. */
    output: string;
}

/** ChatVisionChoice represents a choice for the vision call. */
export interface ChatVisionChoice {
    /** index represents the index position in the collection for
     * this choice. */
    index: number;

    /** message represents a response for this choice. */
    message: ChatVisionMessage;

    /** status represents if the response for this choice was successful
     * or not. */
    status: string;
}

/** ChatVision represents the result for the vision call. */
export interface ChatVision {
    /** id represents a unique identifier for the result. */
    id: string;

    /** object represent the type of the result document. */
    object: string;

    /** created represents the unix timestamp for when the request was
     * received. */
    created: number;

    /** model represents the model used for generating the result. */
    model: Models;

    /** choices represents the collection of choices to choose from. */
    choices: ChatVisionChoice[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** Choice represents an object that contains a result choice. */
export interface CompletionChoice {
    /** index represents the index position in the collection for
     * this choice. */
    index: number;

    /** model represents the model used for generating the result for
     * this choice. */
    model: Models;

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
    choices: CompletionChoice[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** FactualityCheck represents an object that contains a check choice. */
export interface FactualityCheck {
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
    checks: FactualityCheck[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** InjectionCheck represents an object that contains a check choice. */
export interface InjectionCheck {
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
    checks: InjectionCheck[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** ReplacePICheck represents an object that contains a check choice. */
export interface ReplacePICheck {
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
    checks: ReplacePICheck[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** ToxicityCheck represents an object that contains a check choice. */
export interface ToxicityCheck {
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
    checks: ToxicityCheck[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

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

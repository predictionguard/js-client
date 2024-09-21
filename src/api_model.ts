/** Error represents an error that can be returned from the API service. */
export interface Error {
    /** error represents an error message. */
    error: string;
}

// -----------------------------------------------------------------------------

/** Roles represents the set of roles that a sender can represent themselves
 * as. */
export enum Roles {
    Assistant = 'assistant',
    User = 'user',
    System = 'system',
}

/** PIIs represents the set of pii options that can be used. */
export enum PIIs {
    Block = 'block',
    Replace = 'replace',
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

/** ChatInputMessage represents a role and content related to a chat. */
export interface ChatInputMessage {
    /** role represents the role of the sender (user or assistant). */
    role: Roles;

    /** content represents the content of the message. */
    content: string;
}

/** ChatInputOptions represents options for post and preprocessing the input. */
export interface ChatInputOptions {
    /** factuality represents the choice to run the factuality algorithm. */
    factuality: boolean;

    /** toxicity represents the choice to run the toxicity algorithm. */
    toxicity: boolean;

    /** blockPromptInjection represents the choice to run the
     * blockPromptInjection algorithm. */
    blockPromptInjection: boolean;

    /** pii represents the choice to run the repalce personal information
     *  algorithm and which one. */
    pii: PIIs;

    /** piiReplaceMethod represents the method to use for PII. */
    piiReplaceMethod: ReplaceMethods;
}

/** ChatInput represents the full potential input options for chat. */
export interface ChatInput {
    /** model represents the model to use. */
    model: string;

    /** message represents a message to process. */
    messages: string;

    /** maxTokens represents the max number of tokens to return. */
    maxTokens: number;

    /** temperature represents the randomness in GPT's output. */
    temperature: number;

    /** topP represents the diversity of the generated text. */
    topP: number;

    /** topK represents the variability of the generated text. */
    topK: number;

    /** options represents a set of optional parameters. */
    options: ChatInputOptions;
}

/** ChatInputMulti represents the full potential input options for chat. */
export interface ChatInputMulti {
    /** model represents the model to use. */
    model: string;

    /** messages represents the set of messages to process. */
    messages: ChatInputMessage[];

    /** maxTokens represents the max number of tokens to return. */
    maxTokens: number;

    /** temperature represents the randomness in GPT's output. */
    temperature: number;

    /** topP represents the diversity of the generated text. */
    topP: number;

    /** topK represents the variability of the generated text. */
    topK: number;

    /** options represents a set of optional parameters. */
    options: ChatInputOptions;
}

/** ChatMessage represents an object that contains the content and a role. It
 * can be used for input and returned as part of the response. */
export interface ChatMessage {
    /** role represents the role of the sender (user or assistant). */
    role: Roles;

    /** content represents the content of the message. */
    content: string;
}

/** ChatChoice represents an object that contains a result choice. */
export interface ChatChoice {
    /** index represents the index position in the collection for
     * this choice. */
    index: number;

    /** message represents the message response for this choice. */
    message: ChatMessage;
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
    model: string;

    /** choices represents the collection of choices to choose from. */
    choices: ChatChoice[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** ChatSSEInput represents the full potential input options for SSE chat. */
export interface ChatSSEInput {
    /** model represents the model to use. */
    model: string;

    /** messages represents the set of messages to process. */
    messages: ChatInputMessage[];

    /** maxTokens represents the max number of tokens to return. */
    maxTokens: number;

    /** temperature represents the randomness in GPT's output. */
    temperature: number;

    /** topP represents the diversity of the generated text. */
    topP: number;

    /** topK represents the variability of the generated text. */
    topK: number;

    /** onMessage represents a function that will receive the messages. */
    onMessage: (event: ChatSSE | null, err: Error | null) => void;
}

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
    model: string;

    /** choices represents the collection of choices to choose from. */
    choices: ChatSSEChoice[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** ChatVisionInput represents the full potential input options for Vision chat. */
export interface ChatVisionInput {
    /** model represents the model to use. */
    model: string;

    /** role represents the role of the sender (user or assistant). */
    role: Roles;

    /** question represents the question about the image. */
    question: string;

    /** image represents an object that knows how to retrieve an image. */
    image: Base64Encoder;

    /** maxTokens represents the max number of tokens to return. */
    maxTokens: number;

    /** temperature represents the randomness in GPT's output. */
    temperature: number;

    /** topP represents the diversity of the generated text. */
    topP: number;

    /** topK represents the variability of the generated text. */
    topK: number;
}

/** ChatVisionMessage represents content for the vision call. */
export interface ChatVisionMessage {
    /** role represents the role of the sender (user or assistant). */
    role: Roles;

    /** content represents the response for this message. */
    content: string;
}

/** ChatVisionChoice represents a choice for the vision call. */
export interface ChatVisionChoice {
    /** index represents the index position in the collection for
     * this choice. */
    index: number;

    /** message represents a response for this choice. */
    message: ChatVisionMessage;
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
    model: string;

    /** choices represents the collection of choices to choose from. */
    choices: ChatVisionChoice[];

    /** createdDate converts the created unix timestamp into a JS Date. */
    createdDate(): Date;
}

// -----------------------------------------------------------------------------

/** CompletionInput represents the full potential input options for completion. */
export interface CompletionInput {
    /** model represents the model to use. */
    model: string;

    /** prompt represents the prompt to process. */
    prompt: string;

    /** maxTokens represents the max number of tokens to return. */
    maxTokens: number;

    /** temperature represents the randomness in GPT's output. */
    temperature: number;

    /** topP represents the diversity of the generated text. */
    topP: number;

    /** topK represents the variability of the generated text. */
    topK: number;
}

/** Choice represents an object that contains a result choice. */
export interface CompletionChoice {
    /** index represents the index position in the collection for
     * this choice. */
    index: number;

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

/** EmbeddingInput represents the input to generate embeddings. */
export interface EmbeddingInput {
    /** text represents text to vectorize. */
    text: string;

    /** image represents an image to vectorize. */
    image: Base64Encoder;
}

/**  EmbeddingData represents the vector data points. */
export interface EmbeddingData {
    /** index represents the index position in the collection for
     * this choice. */
    index: number;

    /** object represent the type of the result document. */
    object: string;

    //** embedding represents the collection of vector points. */
    embedding: number[];
}

/**  Embedding represents the result for the embedding call. */
export interface Embedding {
    /** id represents a unique identifier for the result. */
    id: string;

    /** object represent the type of the result document. */
    object: string;

    /** created represents the unix timestamp for when the request was
     * received. */
    created: number;

    /** model represents the model used for generating the result. */
    model: string;

    /** EmbeddingData represents the collection of vector points. */
    data: EmbeddingData[];

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

/** ReplacePIICheck represents an object that contains a check choice. */
export interface ReplacePIICheck {
    /** index represents the index position in the collection for
     * this checks. */
    index: number;

    /** new_prompt represents the text with replaced personal information. */
    new_prompt: string;

    /** status represents the status for this check. */
    status: string;
}

/** ReplacePII represents an object that contains the result for the
 * replacepi call. */
export interface ReplacePII {
    /** id represents a unique identifier for the result. */
    id: string;

    /** object represent the type of the result document. */
    object: string;

    /** created represents the unix timestamp for when the request was
     * received. */
    created: number;

    /** checks represents the collection of checks to choose from. */
    checks: ReplacePIICheck[];

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

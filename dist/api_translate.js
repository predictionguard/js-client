var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import client from './api_client.js';
export var translate;
(function (translate) {
    /** Languages represents the set of languages that can be used. */
    var Language;
    (function (Language) {
        Language["Afrikanns"] = "afr";
        Language["Amharic"] = "amh";
        Language["Arabic"] = "ara";
        Language["Armenian"] = "hye";
        Language["Azerbaijan"] = "aze";
        Language["Basque"] = "eus";
        Language["Belarusian"] = "bel";
        Language["Bengali"] = "ben";
        Language["Bosnian"] = "bos";
        Language["Catalan"] = "cat";
        Language["Chechen"] = "che";
        Language["Cherokee"] = "chr";
        Language["Chinese"] = "zho";
        Language["Croatian"] = "hrv";
        Language["Czech"] = "ces";
        Language["Danish"] = "dan";
        Language["Dutch"] = "nld";
        Language["English"] = "eng";
        Language["Estonian"] = "est";
        Language["Fijian"] = "fij";
        Language["Filipino"] = "fil";
        Language["Finnish"] = "fin";
        Language["French"] = "fra";
        Language["Galician"] = "glg";
        Language["Georgian"] = "kat";
        Language["German"] = "deu";
        Language["Greek"] = "ell";
        Language["Gujarati"] = "guj";
        Language["Haitian"] = "hat";
        Language["Hebrew"] = "heb";
        Language["Hindi"] = "hin";
        Language["Hungarian"] = "hun";
        Language["Icelandic"] = "isl";
        Language["Indonesian"] = "ind";
        Language["Irish"] = "gle";
        Language["Italian"] = "ita";
        Language["Japanese"] = "jpn";
        Language["Kannada"] = "kan";
        Language["Kazakh"] = "kaz";
        Language["Korean"] = "kor";
        Language["Latvian"] = "lav";
        Language["Lithuanian"] = "lit";
        Language["Macedonian"] = "mkd";
        Language["Malay1"] = "msa";
        Language["Malay2"] = "zlm";
        Language["Malayalam"] = "mal";
        Language["Maltese"] = "mlt";
        Language["Marathi"] = "mar";
        Language["Nepali"] = "nep";
        Language["Norwegian"] = "nor";
        Language["Persian"] = "fas";
        Language["Polish"] = "pol";
        Language["Portuguese"] = "por";
        Language["Romanian"] = "ron";
        Language["Russian"] = "rus";
        Language["Samoan"] = "smo";
        Language["Serbian"] = "srp";
        Language["Slovak"] = "slk";
        Language["Slovenian"] = "slv";
        Language["Slavonic"] = "chu";
        Language["Spanish"] = "spa";
        Language["Swahili"] = "swh";
        Language["Swedish"] = "swe";
        Language["Tamil"] = "tam";
        Language["Telugu"] = "tel";
        Language["Thai"] = "tha";
        Language["Turkish"] = "tur";
        Language["Ukrainian"] = "ukr";
        Language["Urdu"] = "urd";
        Language["Welsh"] = "cym";
        Language["Vietnamese"] = "vie";
    })(Language = translate.Language || (translate.Language = {}));
    // -------------------------------------------------------------------------
    /** Client provides access to the translate api. */
    var Client = /** @class */ (function (_super) {
        __extends(Client, _super);
        function Client() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /** Translate converts text from one language to another. */
        Client.prototype.Translate = function (text, sourceLang, targetLang) {
            return __awaiter(this, void 0, void 0, function () {
                var zero, body, _a, result, err, e_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            zero = {
                                id: '',
                                object: '',
                                created: 0,
                                best_translation: '',
                                best_translation_model: '',
                                best_score: 0,
                                translations: [],
                            };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            body = {
                                text: text,
                                source_lang: sourceLang,
                                target_lang: targetLang,
                            };
                            return [4 /*yield*/, this.RawDoPost('translate', body)];
                        case 2:
                            _a = _b.sent(), result = _a[0], err = _a[1];
                            if (err != null) {
                                return [2 /*return*/, [zero, err]];
                            }
                            return [2 /*return*/, [result, null]];
                        case 3:
                            e_1 = _b.sent();
                            return [2 /*return*/, [zero, { error: JSON.stringify(e_1) }]];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return Client;
    }(client.Client));
    translate.Client = Client;
})(translate || (translate = {}));
export default translate;

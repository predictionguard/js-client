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
import fetch from 'node-fetch';
export var client;
(function (client) {
    // -------------------------------------------------------------------------
    /** Client provides access to make raw http request calls. */
    var Client = /** @class */ (function () {
        // ---------------------------------------------------------------------
        function Client(url, apiKey) {
            this.url = url;
            this.apiKey = apiKey;
        }
        // ---------------------------------------------------------------------
        /** RawDoGet performs a raw GET call. */
        Client.prototype.RawDoGet = function (endpoint) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, result_1, contextType, result, _b, e_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 12, , 13]);
                            return [4 /*yield*/, fetch("".concat(this.url, "/").concat(endpoint), {
                                    method: 'get',
                                    headers: { 'Content-Type': 'application/json', 'x-api-key': this.apiKey },
                                })];
                        case 1:
                            response = _c.sent();
                            if (!(response.status != 200)) return [3 /*break*/, 6];
                            _a = response.status;
                            switch (_a) {
                                case 404: return [3 /*break*/, 2];
                                case 401: return [3 /*break*/, 3];
                            }
                            return [3 /*break*/, 4];
                        case 2: return [2 /*return*/, [null, { error: 'url not found' }]];
                        case 3: return [2 /*return*/, [null, { error: 'api understands the request but refuses to authorize it' }]];
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result_1 = _c.sent();
                            return [2 /*return*/, [null, result_1]];
                        case 6:
                            contextType = response.headers.get('content-type');
                            _b = true;
                            switch (_b) {
                                case contextType === null || contextType === void 0 ? void 0 : contextType.startsWith('text/plain'): return [3 /*break*/, 7];
                                case contextType === null || contextType === void 0 ? void 0 : contextType.startsWith('application/json'): return [3 /*break*/, 9];
                            }
                            return [3 /*break*/, 11];
                        case 7: return [4 /*yield*/, response.text()];
                        case 8:
                            result = _c.sent();
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, response.json()];
                        case 10:
                            result = _c.sent();
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/, [result, null]];
                        case 12:
                            e_1 = _c.sent();
                            return [2 /*return*/, [null, { error: JSON.stringify(e_1) }]];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        /** RawDoPost performs a raw POST call. */
        Client.prototype.RawDoPost = function (endpoint, body) {
            return __awaiter(this, void 0, void 0, function () {
                var response, _a, result_2, contextType, result, _b, e_2;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 12, , 13]);
                            return [4 /*yield*/, fetch("".concat(this.url, "/").concat(endpoint), {
                                    method: 'post',
                                    headers: { 'Content-Type': 'application/json', 'x-api-key': this.apiKey },
                                    body: JSON.stringify(body),
                                })];
                        case 1:
                            response = _c.sent();
                            if (!(response.status != 200)) return [3 /*break*/, 6];
                            _a = response.status;
                            switch (_a) {
                                case 404: return [3 /*break*/, 2];
                                case 401: return [3 /*break*/, 3];
                            }
                            return [3 /*break*/, 4];
                        case 2: return [2 /*return*/, [null, { error: 'url not found' }]];
                        case 3: return [2 /*return*/, [null, { error: 'api understands the request but refuses to authorize it' }]];
                        case 4: return [4 /*yield*/, response.json()];
                        case 5:
                            result_2 = _c.sent();
                            return [2 /*return*/, [null, result_2]];
                        case 6:
                            contextType = response.headers.get('content-type');
                            _b = true;
                            switch (_b) {
                                case contextType === null || contextType === void 0 ? void 0 : contextType.startsWith('text/plain'): return [3 /*break*/, 7];
                                case contextType === null || contextType === void 0 ? void 0 : contextType.startsWith('application/json'): return [3 /*break*/, 9];
                            }
                            return [3 /*break*/, 11];
                        case 7: return [4 /*yield*/, response.text()];
                        case 8:
                            result = _c.sent();
                            return [3 /*break*/, 11];
                        case 9: return [4 /*yield*/, response.json()];
                        case 10:
                            result = _c.sent();
                            return [3 /*break*/, 11];
                        case 11: return [2 /*return*/, [result, null]];
                        case 12:
                            e_2 = _c.sent();
                            return [2 /*return*/, [null, { error: JSON.stringify(e_2) }]];
                        case 13: return [2 /*return*/];
                    }
                });
            });
        };
        return Client;
    }());
    client.Client = Client;
})(client || (client = {}));
export default client;

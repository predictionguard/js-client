var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import client from '../client.js';
// Construct the client to have access to the prediction guard API.
const cln = new client.Client('https://api.predictionguard.com', process.env.PGKEY);
function Chat() {
    return __awaiter(this, void 0, void 0, function* () {
        const messages = [
            {
                role: 'user',
                content: 'How do you feel about the world in general',
            },
        ];
        var [result, err] = yield cln.Chat('Neural-Chat-7B', 1000, 1.1, messages);
        if (err != null) {
            console.log('ERROR:' + err);
            return;
        }
        console.log('RESULT:' + result.choices[0].message.content);
    });
}
Chat();

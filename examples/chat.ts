import api from '../api.ts';
import chat from '../api_chat.ts';

const cln = new api.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Chat() {
    const messages: chat.Message[] = [
        {
            role: api.Role.User,
            content: 'How do you feel about the world in general',
        },
    ];

    var [result, err] = await cln.Chat.Do(api.Model.NeuralChat7B, 1000, 1.1, messages);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.model + ': ' + result.choices[0].message.content);
}

Chat();

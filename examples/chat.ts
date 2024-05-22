import chat from '../src/api_chat.js';

const client = new chat.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Chat() {
    const messages: chat.Message[] = [
        {
            role: chat.Role.User,
            content: 'How do you feel about the world in general',
        },
    ];

    var [result, err] = await client.Chat(chat.Model.NeuralChat7B, 1000, 1.1, messages);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.model + ': ' + result.choices[0].message.content);
}

Chat();

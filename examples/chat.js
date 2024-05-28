import * as pg from '../dist/index.js';

const client = new pg.chat.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Chat() {
    const input = [
        {
            role: pg.chat.Role.User,
            content: 'How do you feel about the world in general',
        },
    ];

    var [result, err] = await client.Chat(pg.chat.Model.NeuralChat7B, input, 1000, 1.1);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.model + ': ' + result.choices[0].message.content);
}

Chat();

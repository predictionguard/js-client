import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Chat() {
    const model = pg.Models.NeuralChat7B;
    const input = [
        {
            role: pg.Roles.User,
            content: 'How do you feel about the world in general',
        },
    ];
    const maxTokens = 1000;
    const temperature = 1.1;

    var [result, err] = await client.Chat(model, input, maxTokens, temperature);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
}

Chat();

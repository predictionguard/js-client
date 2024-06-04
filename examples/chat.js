import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Chat() {
    const input = {
        model: pg.Models.NeuralChat7B,
        messages: [
            {
                role: pg.Roles.User,
                content: 'How do you feel about the world in general',
            },
        ],
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
        options: {
            factuality: true,
            toxicity: true,
            pii: pg.PIIs.Replace,
            piiReplaceMethod: pg.ReplaceMethods.Random,
        },
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
}

Chat();

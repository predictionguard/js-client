import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function Chat() {
    const input = {
        model: 'Neural-Chat-7B',
        messages: 'How do you feel about the world in general',
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
        topK: 50,
        inputExtension: {
            pii: pg.PIIs.Replace,
            piiReplaceMethod: pg.ReplaceMethods.Random,
        },
        outputExtension: {
            factuality: true,
            toxicity: true,
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

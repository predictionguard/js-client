import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function Completions() {
    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Will I lose my hair',
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

    var [result, err] = await client.Completion(input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.choices[0].text);
}

Completions();

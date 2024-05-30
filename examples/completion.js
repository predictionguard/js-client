import * as pg from '../dist/index.js';

const client = new pg.completion.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Completions() {
    const model = pg.completion.Model.NeuralChat7B;
    const maxTokens = 1000;
    const temperature = 1.1;
    const prompt = 'Will I lose my hair';

    var [result, err] = await client.Completion(model, maxTokens, temperature, prompt);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.choices[0].text);
}

Completions();

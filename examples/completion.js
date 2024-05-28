import * as pg from '../dist/index.js';

const client = new pg.completion.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Completions() {
    var [result, err] = await client.Completion(pg.completion.Model.NeuralChat7B, 1000, 1.0, 'Will I lose my hair');
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.choices[0].text);
}

Completions();

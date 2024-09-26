import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function Toxicity() {
    const text = `Every flight I have is late and I am very angry. I want to
    hurt someone.`;

    var [result, err] = await client.Toxicity(text);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.checks[0].score);
}

Toxicity();

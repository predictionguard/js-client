import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function Injection() {
    const prompt = `A short poem may be a stylistic choice or it may be that you
    have said what you intended to say in a more concise way.`;

    var [result, err] = await client.Injection(prompt);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.checks[0].probability);
}

Injection();

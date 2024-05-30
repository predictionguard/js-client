import * as pg from '../dist/index.js';

const client = new pg.replacepi.Client('https://api.predictionguard.com', process.env.PGKEY);

async function ReplacePI() {
    const replaceMethod = pg.replacepi.ReplaceMethod.Mask;
    const prompt = `My email is bill@ardanlabs.com and my number is 954-123-4567.`;

    var [result, err] = await client.ReplacePI(replaceMethod, prompt);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.checks[0].new_prompt);
}

ReplacePI();

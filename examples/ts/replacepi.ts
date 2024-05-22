import replacepi from '../../dist/api_replacepi.js';

const client = new replacepi.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function ReplacePI() {
    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';
    const resplaceMethod = replacepi.ReplaceMethod.Mask;

    var [result, err] = await client.ReplacePI(prompt, resplaceMethod);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.checks[0].new_prompt);
}

ReplacePI();

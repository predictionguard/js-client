import api from '../api.ts';

const client = new api.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function ReplacePI() {
    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';
    const resplaceMethod = 'mask';

    var [result, err] = await client.ReplacePI.Do(prompt, resplaceMethod);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.checks[0].new_prompt);
}

ReplacePI();

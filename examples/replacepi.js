import Client from '../client.js';

// Construct the client to have access to the prediction guard API.
const client = new Client('https://api.predictionguard.com', process.env.PGKEY);

async function ReplacePI() {
    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';
    const resplaceMethod = 'mask';

    var [result, err] = await client.ReplacePI(prompt, resplaceMethod);
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log('RESULT:' + result.checks[0].new_prompt);
}

ReplacePI();

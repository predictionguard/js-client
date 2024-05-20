import Client from '../client.js';

// Construct the client to have access to the prediction guard API.
const client = new Client('https://api.predictionguard.com', process.env.PGKEY);

async function Injection() {
    const prompt =
        'A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.';

    var [result, err] = await client.Injection(prompt);
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log('RESULT:' + result.checks[0].probability);
}

Injection();

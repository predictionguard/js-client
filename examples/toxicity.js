import Client from '../client.js';

// Construct the client to have access to the prediction guard API.
const client = new Client('https://api.predictionguard.com', process.env.PGKEY);

async function Toxicity() {
    const text = 'Every flight I have is late and I am very angry. I want to hurt someone.';

    var [result, err] = await client.Toxicity(text);
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log('RESULT:' + result.checks[0].score);
}

Toxicity();

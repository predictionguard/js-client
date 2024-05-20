import Client from '../client.js';

// Construct the client to have access to the prediction guard API.
const client = new Client('https://api.predictionguard.com', process.env.PGKEY);

async function Completions() {
    var [result, err] = await client.Completions('Neural-Chat-7B', 1000, 1.0, 'Will I lose my hair');
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log('RESULT:' + result.choices[0].text);
}

Completions();

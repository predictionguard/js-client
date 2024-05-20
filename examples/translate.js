import Client from '../client.js';

// Construct the client to have access to the prediction guard API.
const client = new Client('https://api.predictionguard.com', process.env.PGKEY);

async function Translate() {
    const text = 'The rain in Spain stays mainly in the plain';

    var [result, err] = await client.Translate(text, 'eng', 'spa');
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log('RESULT:' + result.best_translation);
}

Translate();

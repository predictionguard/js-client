import Client from '../client.js';

// Construct the client to have access to the prediction guard API.
const client = new Client('https://api.predictionguard.com', process.env.PGKEY);

async function HealthCheck() {
    var [result, err] = await client.HealthCheck();
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log(result);
}

HealthCheck();

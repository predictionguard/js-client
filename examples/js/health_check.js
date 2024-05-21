import health from '../../dist/api_health.js';

const client = new health.Client('https://api.predictionguard.com', process.env.PGKEY);

async function HealthCheck() {
    var [result, err] = await client.HealthCheck();
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log(result);
}

HealthCheck();

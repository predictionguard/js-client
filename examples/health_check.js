import * as pg from '../dist/index.js';

const client = new pg.health.Client('https://api.predictionguard.com', process.env.PGKEY);

async function HealthCheck() {
    var [result, err] = await client.HealthCheck();
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log(result);
}

HealthCheck();

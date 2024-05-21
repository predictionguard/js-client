import api from '../api.ts';

const client = new api.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function HealthCheck() {
    var [result, err] = await client.HealthCheck.Do();
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log(result);
}

HealthCheck();

import api from '../api.ts';

const client = new api.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Completions() {
    var [result, err] = await client.Completion.Do('Neural-Chat-7B', 1000, 1.0, 'Will I lose my hair');
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.choices[0].text);
}

Completions();

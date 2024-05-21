import api from '../api.ts';

const client = new api.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Toxicity() {
    const text = 'Every flight I have is late and I am very angry. I want to hurt someone.';

    var [result, err] = await client.Toxicity.Do(text);
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log('RESULT:' + result.checks[0].score);
}

Toxicity();

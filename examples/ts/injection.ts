import injection from '../../dist/api_injection.js';

const client = new injection.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Injection() {
    const prompt = 'A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.';

    var [result, err] = await client.Injection(prompt);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.checks[0].probability);
}

Injection();

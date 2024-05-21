import api from '../api.ts';

const client = new api.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Translate() {
    const text = 'The rain in Spain stays mainly in the plain';

    var [result, err] = await client.Translate.Do(text, 'eng', 'spa');
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log('RESULT:' + result.best_translation);
}

Translate();

import api from '../api.ts';

const client = new api.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Translate() {
    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = api.Language.English;
    const targetLang = api.Language.Spanish;

    var [result, err] = await client.Translate.Do(text, sourceLang, targetLang);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.best_translation);
}

Translate();

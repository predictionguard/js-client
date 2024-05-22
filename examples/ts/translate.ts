import translate from '../../dist/api_translate.js';

const client = new translate.Client('https://api.predictionguard.com', process.env.PGKEY as string);

async function Translate() {
    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = translate.Language.English;
    const targetLang = translate.Language.Spanish;

    var [result, err] = await client.Translate(text, sourceLang, targetLang);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.best_translation);
}

Translate();

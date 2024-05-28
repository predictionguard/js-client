import * as pg from '../dist/index.js';

const client = new pg.translate.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Translate() {
    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = pg.translate.Language.English;
    const targetLang = pg.translate.Language.Spanish;

    var [result, err] = await client.Translate(text, sourceLang, targetLang);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.best_translation);
}

Translate();

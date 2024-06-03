import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Translate() {
    const sourceLang = pg.Languages.English;
    const targetLang = pg.Languages.Spanish;
    const text = `The rain in Spain stays mainly in the plain`;

    var [result, err] = await client.Translate(text, sourceLang, targetLang);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.best_translation);
}

Translate();

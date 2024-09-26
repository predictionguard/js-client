import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function Translate() {
    const text = `The rain in Spain stays mainly in the plain`;
    const sourceLang = pg.Languages.English;
    const targetLang = pg.Languages.Spanish;
    const useThirdPartyEngine = false;

    var [result, err] = await client.Translate(text, sourceLang, targetLang, useThirdPartyEngine);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.best_translation);
}

Translate();

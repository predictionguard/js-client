import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function Embedding() {
    const image = new pg.ImageNetwork('https://pbs.twimg.com/profile_images/1571574401107169282/ylAgz_f5_400x400.jpg');

    const input = [
        {
            text: 'This is Bill Kennedy, a decent Go developer.',
            image: image,
        },
    ];

    var [result, err] = await client.Embedding('bridgetower-large-itm-mlm-itc', input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    for (const dt of result.data) {
        process.stdout.write(dt.embedding.toString());
    }
}

Embedding();

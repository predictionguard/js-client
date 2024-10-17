import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function Embedding() {
    const image = new pg.ImageNetwork('https://predictionguard.com/lib_eltrNYEjQbpUWFRI/oy2r533pndpk0q8q.png?w=1024&dpr=2');

    const input1 = [
        {
            text: 'This is Bill Kennedy, a decent Go developer.',
            image: image,
        },
    ];

    var [result1, err] = await client.Embedding('bridgetower-large-itm-mlm-itc', input1);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    for (const dt of result1.data) {
        process.stdout.write(dt.embedding.toString());
    }

    const input2 = [
        {
            text: 'This is Bill Kennedy, a decent Go developer.',
        },
    ];

    var [result2, err] = await client.Embedding('multilingual-e5-large-instruct', input2, true, pg.Directions.Right);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    for (const dt of result2.data) {
        process.stdout.write(dt.embedding.toString());
    }
}

Embedding();

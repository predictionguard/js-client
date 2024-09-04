import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);

async function ChatVision() {
    const image = new pg.ImageNetwork('https://images.ctfassets.net/hrltx12pl8hq/7GlCy7xexnzzrAARg86iUj/f4429bfa8397f81a2429ea003181347f/Autumn_Vectors.jpg');

    const input = {
        role: pg.Roles.User,
        question: 'is there a deer in this picture',
        image: image,
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
        topK: 50.0,
    };

    var [result, err] = await client.ChatVision(input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
}

ChatVision();

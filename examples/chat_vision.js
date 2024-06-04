import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);

async function ChatVision() {
    const image = new pg.ImageNetwork('https://pbs.twimg.com/profile_images/1571574401107169282/ylAgz_f5_400x400.jpg');

    const input = {
        role: pg.Roles.User,
        question: 'is there a deer in this picture',
        image: image,
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
    };

    var [result, err] = await client.ChatVision(input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
}

ChatVision();

import * as pg from '../dist/index.js';

const client = new pg.Client('https://staging.predictionguard.com', process.env.PGKEYSTAGE);

async function ChatVision() {
    const role = pg.Roles.User;
    const question = 'is there a deer in this picture';

    const image = new pg.ImageNetwork('https://pbs.twimg.com/profile_images/1571574401107169282/ylAgz_f5_400x400.jpg');
    // const file = new pg.ImageFile('/Users/bill/Documents/images/pGwOq5tz_400x400.jpg');

    const maxTokens = 300;
    const temperature = 0.1;

    var [result, err] = await client.ChatVision(role, question, image, maxTokens, temperature);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
}

ChatVision();

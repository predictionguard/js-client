import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function ChatVision() {
    const image = new pg.ImageNetwork('https://predictionguard.com/lib_eltrNYEjQbpUWFRI/oy2r533pndpk0q8q.png?w=1024&dpr=2');

    const input = {
        model: 'llava-1.5-7b-hf',
        role: pg.Roles.User,
        question: 'Is there a computer in this picture?',
        image: image,
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
        topK: 50,
        inputExtension: {
            pii: pg.PIIs.Replace,
            piiReplaceMethod: pg.ReplaceMethods.Random,
        },
        outputExtension: {
            factuality: true,
            toxicity: true,
        },
    };

    var [result, err] = await client.ChatVision(input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
}

ChatVision();

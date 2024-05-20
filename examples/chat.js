import Client from '../client.js';

// Construct the client to have access to the prediction guard API.
const client = new Client('https://api.predictionguard.com', process.env.PGKEY);

async function Chat() {
    const messages = [
        {
            role: 'user',
            content: 'How do you feel about the world in general',
        },
    ];

    var [result, err] = await client.Chat('Neural-Chat-7B', 1000, 1.1, messages);
    if (err != null) {
        console.log('ERROR:' + err);
        return;
    }

    console.log('RESULT:' + result.choices[0].message.content);
}

Chat();

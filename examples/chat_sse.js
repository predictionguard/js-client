import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);

async function ChatSSE() {
    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'How do you feel about the world in general',
            },
        ],
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
        topK: 50,
        onMessage: function (event, err) {
            if (err != null) {
                if (err.error == 'EOF') {
                    return;
                }
                console.log(err);
            }

            for (const choice of event.choices) {
                if (choice.delta.hasOwnProperty('content')) {
                    process.stdout.write(choice.delta.content);
                }
            }
        },
    };

    var err = await client.ChatSSE(input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }
}

ChatSSE();

import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);

async function ChatSSE() {
    const model = pg.Models.NeuralChat7B;
    const input = [
        {
            role: pg.Roles.User,
            content: 'How do you feel about the world in general',
        },
    ];
    const maxTokens = 1000;
    const temperature = 1.1;

    const onMessage = function (event, err) {
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
    };

    var err = await client.ChatSSE(model, input, maxTokens, temperature, onMessage);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }
}

ChatSSE();

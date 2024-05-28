import chat from '../dist/api_chat.js';

const client = new chat.Client('https://api.predictionguard.com', process.env.PGKEY);

async function ChatSSE() {
    const messages = [
        {
            role: chat.Role.User,
            content: 'How do you feel about the world in general',
        },
    ];

    const f = function (event, err) {
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

    var err = await client.ChatSSE(chat.Model.NeuralChat7B, 1000, 1.1, messages, f);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }
}

ChatSSE();

import mockServer from 'mockttp';
import assert from 'assert';
import chat from '../dist/api_chat.js';

const proxy = mockServer.getLocal({
    cors: false,
    debug: false,
    recordTraffic: false,
});

const client = new chat.Client('http://localhost:8080', 'any key');

describe('Test_Client', () => {
    before(() =>
        (function () {
            proxy.start(8080);

            proxy.forPost('/chat/completions').thenJson(200, {
                id: 'chat-ShL1yk0N0h1lzmrJDQCpCz3WQFQh9',
                object: 'chat_completion',
                created: 1715628729,
                model: 'Neural-Chat-7B',
                choices: [
                    {
                        index: 0,
                        message: {
                            role: 'assistant',
                            content:
                                "The world, in general, is full of both beauty and challenges. It can be considered as a mixed bag with various aspects to explore, understand, and appreciate. There are countless achievements in terms of scientific advancements, medical breakthroughs, and technological innovations. On the other hand, the world often encounters issues related to inequality, conflicts, environmental degradation, and moral complexities.\n\nPersonally, it's essential to maintain a balance and perspective while navigating these dimensions. It means trying to find the silver lining behind every storm, practicing gratitude, and embracing empathy to connect with and help others. Actively participating in making the world a better place by supporting causes close to one's heart can also provide a sense of purpose and hope.",
                            output: '',
                        },
                        status: 'success',
                    },
                ],
            });
        })()
    );
    after(() =>
        (function () {
            proxy.stop();
        })()
    );

    it('chat', async function () {
        const messages = [
            {
                role: chat.Role.User,
                content: 'How do you feel about the world in general',
            },
        ];

        var [result, err] = await client.Chat(chat.Model.NeuralChat7B, 1000, 1.1, messages);
        if (err != null) {
            assert.fail('ERROR:' + err.error);
        }

        const expResp = {
            id: 'chat-ShL1yk0N0h1lzmrJDQCpCz3WQFQh9',
            object: 'chat_completion',
            created: 1715628729,
            model: 'Neural-Chat-7B',
            choices: [
                {
                    index: 0,
                    message: {
                        role: 'assistant',
                        content:
                            "The world, in general, is full of both beauty and challenges. It can be considered as a mixed bag with various aspects to explore, understand, and appreciate. There are countless achievements in terms of scientific advancements, medical breakthroughs, and technological innovations. On the other hand, the world often encounters issues related to inequality, conflicts, environmental degradation, and moral complexities.\n\nPersonally, it's essential to maintain a balance and perspective while navigating these dimensions. It means trying to find the silver lining behind every storm, practicing gratitude, and embracing empathy to connect with and help others. Actively participating in making the world a better place by supporting causes close to one's heart can also provide a sense of purpose and hope.",
                        output: '',
                    },
                    status: 'success',
                },
            ],
        };

        const got = JSON.stringify(result);
        const exp = JSON.stringify(expResp);

        assert.equal(got, exp);
    });
});

import mockServer from 'mockttp';
import assert from 'assert';
import {chat, completion, factuality, injection, replacepi, toxicity, translate} from '../dist/index.js';

const proxy = mockServer.getLocal({
    cors: false,
    debug: false,
    recordTraffic: false,
});

// =============================================================================

describe('Test_Client', () => {
    before(() => {
        proxy.start(8080);

        proxy.forPost('/chat/completions').thenCallback((request) => {
            if (request.headers['x-api-key'] == '') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: chatResp,
            };
        });

        proxy.forPost('/completions').thenCallback((request) => {
            if (request.headers['x-api-key'] == '') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: completionResp,
            };
        });

        proxy.forPost('/factuality').thenCallback((request) => {
            if (request.headers['x-api-key'] == '') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: factualityResp,
            };
        });

        proxy.forPost('/injection').thenCallback((request) => {
            if (request.headers['x-api-key'] == '') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: injectionResp,
            };
        });

        proxy.forPost('/PII').thenCallback((request) => {
            if (request.headers['x-api-key'] == '') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: replacePIResp,
            };
        });

        proxy.forPost('/toxicity').thenCallback((request) => {
            if (request.headers['x-api-key'] == '') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: toxicityResp,
            };
        });

        proxy.forPost('/translate').thenCallback((request) => {
            if (request.headers['x-api-key'] == '') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: translateResp,
            };
        });
    });

    // ---------------------------------------------------------------------

    after(() => proxy.stop());

    // ---------------------------------------------------------------------

    it('chat-basic', async () => {
        await testChatBasic();
    });

    it('chat-badkey', async () => {
        await testChatBadkey();
    });

    // ---------------------------------------------------------------------

    it('completion-basic', async () => {
        await testCompletionBasic();
    });

    it('completion-badkey', async () => {
        await testCompletionBadkey();
    });

    // ---------------------------------------------------------------------

    it('factuality-basic', async () => {
        await testFactualityBasic();
    });

    it('factuality-badkey', async () => {
        await testFactualityBadkey();
    });

    // ---------------------------------------------------------------------

    it('injection-basic', async () => {
        await testInjectionBasic();
    });

    it('injection-badkey', async () => {
        await testInjectionBadkey();
    });

    // ---------------------------------------------------------------------

    it('replacePI-basic', async () => {
        await testReplacePIBasic();
    });

    it('replacePI-badkey', async () => {
        await testReplacePIBadkey();
    });

    // ---------------------------------------------------------------------

    it('toxicity-basic', async () => {
        await testToxicityBasic();
    });

    it('toxicity-badkey', async () => {
        await testToxicityBadkey();
    });

    // ---------------------------------------------------------------------

    it('translate-basic', async () => {
        await testTranslateBasic();
    });

    it('translate-badkey', async () => {
        await testTranslateBadkey();
    });
});

// =============================================================================

const chatResp = {
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

async function testChatBasic() {
    const client = new chat.Client('http://localhost:8080', 'any key');

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

    const got = JSON.stringify(result);
    const exp = JSON.stringify(chatResp);

    assert.equal(got, exp);
}

async function testChatBadkey() {
    const client = new chat.Client('http://localhost:8080', '');

    const messages = [
        {
            role: chat.Role.User,
            content: 'How do you feel about the world in general',
        },
    ];

    var [_, err] = await client.Chat(chat.Model.NeuralChat7B, 1000, 1.1, messages);
    if (err == null) {
        assert.fail("didn't get an error");
    }

    const got = JSON.stringify(err);
    const exp = JSON.stringify({
        error: 'api understands the request but refuses to authorize it',
    });

    assert.equal(got, exp);
}

// =============================================================================

const completionResp = {
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

async function testCompletionBasic() {
    const client = new completion.Client('http://localhost:8080', 'any key');

    var [result, err] = await client.Completion(completion.Model.NeuralChat7B, 1000, 1.0, 'Will I lose my hair');
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(completionResp);

    assert.equal(got, exp);
}

async function testCompletionBadkey() {
    const client = new completion.Client('http://localhost:8080', '');

    var [_, err] = await client.Completion(completion.Model.NeuralChat7B, 1000, 1.0, 'Will I lose my hair');
    if (err == null) {
        assert.fail("didn't get an error");
    }

    const got = JSON.stringify(err);
    const exp = JSON.stringify({
        error: 'api understands the request but refuses to authorize it',
    });

    assert.equal(got, exp);
}

// =============================================================================

const factualityResp = {
    id: 'fact-GK9kueuMw0NQLc0sYEIVlkGsPH31R',
    object: 'factuality_check',
    created: 1715730425,
    checks: [
        {
            Score: 0.7879658937454224,
            Index: 0,
            Status: 'success',
        },
    ],
};

async function testFactualityBasic() {
    const client = new factuality.Client('http://localhost:8080', 'any key');

    const fact =
        'The President shall receive in full for his services during the term for which he shall have been elected compensation in the aggregate amount of 400,000 a year, to be paid monthly, and in addition an expense allowance of 50,000 to assist in defraying expenses relating to or resulting from the discharge of his official duties. Any unused amount of such expense allowance shall revert to the Treasury pursuant to section 1552 of title 31, United States Code. No amount of such expense allowance shall be included in the gross income of the President. He shall be entitled also to the use of the furniture and other effects belonging to the United States and kept in the Executive Residence at the White House.';
    const text = 'The president of the united states can take a salary of one million dollars';

    var [result, err] = await client.Factuality(fact, text);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(factualityResp);

    assert.equal(got, exp);
}

async function testFactualityBadkey() {
    const client = new factuality.Client('http://localhost:8080', '');

    const fact =
        'The President shall receive in full for his services during the term for which he shall have been elected compensation in the aggregate amount of 400,000 a year, to be paid monthly, and in addition an expense allowance of 50,000 to assist in defraying expenses relating to or resulting from the discharge of his official duties. Any unused amount of such expense allowance shall revert to the Treasury pursuant to section 1552 of title 31, United States Code. No amount of such expense allowance shall be included in the gross income of the President. He shall be entitled also to the use of the furniture and other effects belonging to the United States and kept in the Executive Residence at the White House.';
    const text = 'The president of the united states can take a salary of one million dollars';

    var [_, err] = await client.Factuality(fact, text);
    if (err == null) {
        assert.fail("didn't get an error");
    }

    const got = JSON.stringify(err);
    const exp = JSON.stringify({
        error: 'api understands the request but refuses to authorize it',
    });

    assert.equal(got, exp);
}

// =============================================================================

const injectionResp = {
    id: 'injection-Nb817UlEMTog2YOe1JHYbq2oUyZAW7Lk',
    object: 'injection_check',
    created: 1715729859,
    checks: [
        {
            Probability: 0.5,
            Index: 0,
            Status: 'success',
        },
    ],
};

async function testInjectionBasic() {
    const client = new injection.Client('http://localhost:8080', 'any key');

    const prompt = 'A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.';

    var [result, err] = await client.Injection(prompt);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(injectionResp);

    assert.equal(got, exp);
}

async function testInjectionBadkey() {
    const client = new injection.Client('http://localhost:8080', '');

    const prompt = 'A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.';

    var [result, err] = await client.Injection(prompt);
    if (err == null) {
        assert.fail("didn't get an error");
    }

    const got = JSON.stringify(err);
    const exp = JSON.stringify({
        error: 'api understands the request but refuses to authorize it',
    });

    assert.equal(got, exp);
}

// =============================================================================

const replacePIResp = {
    id: 'pii-ax9rE9ld3W5yxN1Sz7OKxXkMTMo736jJ',
    object: 'pii_check',
    created: 1715730803,
    checks: [
        {
            NewPrompt: 'My email is * and my number is *.',
            Index: 0,
            Status: 'success',
        },
    ],
};

async function testReplacePIBasic() {
    const client = new replacepi.Client('http://localhost:8080', 'any key');

    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';
    const resplaceMethod = replacepi.ReplaceMethod.Mask;

    var [result, err] = await client.ReplacePI(prompt, resplaceMethod);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(replacePIResp);

    assert.equal(got, exp);
}

async function testReplacePIBadkey() {
    const client = new replacepi.Client('http://localhost:8080', '');

    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';
    const resplaceMethod = replacepi.ReplaceMethod.Mask;

    var [_, err] = await client.ReplacePI(prompt, resplaceMethod);
    if (err == null) {
        assert.fail("didn't get an error");
    }

    const got = JSON.stringify(err);
    const exp = JSON.stringify({
        error: 'api understands the request but refuses to authorize it',
    });

    assert.equal(got, exp);
}

// =============================================================================

const toxicityResp = {
    id: 'toxi-vRvkxJHmAiSh3NvuuSc48HQ669g7y',
    object: 'toxicity_check',
    created: 1715731131,
    checks: [
        {
            Score: 0.7072361707687378,
            Index: 0,
            Status: 'success',
        },
    ],
};

async function testToxicityBasic() {
    const client = new toxicity.Client('http://localhost:8080', 'any key');

    const text = 'Every flight I have is late and I am very angry. I want to hurt someone.';

    var [result, err] = await client.Toxicity(text);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(toxicityResp);

    assert.equal(got, exp);
}

async function testToxicityBadkey() {
    const client = new toxicity.Client('http://localhost:8080', '');

    const text = 'Every flight I have is late and I am very angry. I want to hurt someone.';

    var [_, err] = await client.Toxicity(text);
    if (err == null) {
        assert.fail("didn't get an error");
    }

    const got = JSON.stringify(err);
    const exp = JSON.stringify({
        error: 'api understands the request but refuses to authorize it',
    });

    assert.equal(got, exp);
}

// =============================================================================

const translateResp = {
    id: 'translation-0210cae4da704099b58471876ffa3d2e',
    object: 'translation',
    created: 1715731416,
    best_translation: 'La lluvia en España permanece principalmente en la llanura',
    best_translation_model: 'google',
    score: 0.5381188988685608,
    translations: [
        {
            score: -100,
            translation: '',
            model: 'openai',
            status: "error: couldn't get translation",
        },
        {
            score: 0.5008206963539124,
            translation: 'La lluvia en España se queda principalmente en la llanura',
            model: 'deepl',
            status: 'success',
        },
        {
            score: 0.5381188988685608,
            translation: 'La lluvia en España permanece principalmente en la llanura',
            model: 'google',
            status: 'success',
        },
        {
            score: 0.48437628149986267,
            translation: 'La lluvia en España se queda principalmente en la llanura.',
            model: 'nous_hermes_llama2',
            status: 'success',
        },
    ],
};

async function testTranslateBasic() {
    const client = new translate.Client('http://localhost:8080', 'any key');

    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = translate.Language.English;
    const targetLang = translate.Language.Spanish;

    var [result, err] = await client.Translate(text, sourceLang, targetLang);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(translateResp);

    assert.equal(got, exp);
}

async function testTranslateBadkey() {
    const client = new translate.Client('http://localhost:8080', '');

    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = translate.Language.English;
    const targetLang = translate.Language.Spanish;

    var [_, err] = await client.Translate(text, sourceLang, targetLang);
    if (err == null) {
        assert.fail("didn't get an error");
    }

    const got = JSON.stringify(err);
    const exp = JSON.stringify({
        error: 'api understands the request but refuses to authorize it',
    });

    assert.equal(got, exp);
}

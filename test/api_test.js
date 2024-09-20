import mockServer from 'mockttp';
import assert from 'assert';
import * as pg from '../dist/index.js';

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
            const auth = request.headers['authorization'];
            if (typeof auth == 'undefined' || auth == 'Bearer') {
                return {
                    statusCode: 403,
                };
            }

            const result = request.body.getJson().then((body) => {
                if (body.model == 'llava-1.5-7b-hf') {
                    return {
                        statusCode: 200,
                        json: chatVisionResp,
                    };
                }

                return {
                    statusCode: 200,
                    json: chatResp,
                };
            });

            return result;
        });

        proxy.forPost('/completions').thenCallback((request) => {
            const auth = request.headers['authorization'];
            if (typeof auth == 'undefined' || auth == 'Bearer') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: completionResp,
            };
        });

        proxy.forPost('/embeddings').thenCallback((request) => {
            const auth = request.headers['authorization'];
            if (typeof auth == 'undefined' || auth == 'Bearer') {
                return {
                    statusCode: 403,
                };
            }

            return {
                statusCode: 200,
                json: embeddingResp,
            };
        });

        proxy.forPost('/factuality').thenCallback((request) => {
            const auth = request.headers['authorization'];
            if (typeof auth == 'undefined' || auth == 'Bearer') {
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
            const auth = request.headers['authorization'];
            if (typeof auth == 'undefined' || auth == 'Bearer') {
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
            const auth = request.headers['authorization'];
            if (typeof auth == 'undefined' || auth == 'Bearer') {
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
            const auth = request.headers['authorization'];
            if (typeof auth == 'undefined' || auth == 'Bearer') {
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
            const auth = request.headers['authorization'];
            if (typeof auth == 'undefined' || auth == 'Bearer') {
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

    // -------------------------------------------------------------------------

    after(() => proxy.stop());

    // -------------------------------------------------------------------------

    it('chat-basic', async () => {
        await testChatBasic();
    });

    it('chat-vision', async () => {
        await testChatVision();
    });

    it('chat-badkey', async () => {
        await testChatBadkey();
    });

    // -------------------------------------------------------------------------

    it('completion-basic', async () => {
        await testCompletionBasic();
    });

    it('completion-badkey', async () => {
        await testCompletionBadkey();
    });

    // -------------------------------------------------------------------------

    it('embedding-basic', async () => {
        await testEmbeddingBasic();
    });

    it('embedding-badkey', async () => {
        await testEmbeddingBadkey();
    });

    // -------------------------------------------------------------------------

    it('factuality-basic', async () => {
        await testFactualityBasic();
    });

    it('factuality-badkey', async () => {
        await testFactualityBadkey();
    });

    // -------------------------------------------------------------------------

    it('injection-basic', async () => {
        await testInjectionBasic();
    });

    it('injection-badkey', async () => {
        await testInjectionBadkey();
    });

    // -------------------------------------------------------------------------

    it('replacePI-basic', async () => {
        await testReplacePIIBasic();
    });

    it('replacePI-badkey', async () => {
        await testReplacePIIBadkey();
    });

    // -------------------------------------------------------------------------

    it('toxicity-basic', async () => {
        await testToxicityBasic();
    });

    it('toxicity-badkey', async () => {
        await testToxicityBadkey();
    });

    // -------------------------------------------------------------------------

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
        },
    ],
};

const chatVisionResp = {
    id: 'chat-cmSAaDWzqAVOVuGePjDv1HjwVn5SQ',
    object: 'chat_completion',
    created: 1717437819,
    model: 'llava-1.5-7b-hf',
    choices: [
        {
            index: 0,
            message: {
                role: 'assistant',
                content: '?\n\nThe man is wearing a hat, glasses, and a sweater.',
                output: null,
            },
        },
    ],
};

async function testChatBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

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
        options: {
            factuality: true,
            toxicity: true,
            pii: pg.PIIs.Replace,
            piiReplaceMethod: pg.ReplaceMethods.Random,
        },
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(chatResp);

    assert.equal(got, exp);
}

async function testChatVision() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const imageMock = {
        EncodeBase64: function () {
            return ['', null];
        },
    };

    const input = {
        model: 'llava-1.5-7b-hf',
        role: pg.Roles.User,
        question: 'is there a deer in this picture',
        image: imageMock,
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
    };

    var [result, err] = await client.ChatVision(input);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(chatVisionResp);

    assert.equal(got, exp);
}

async function testChatBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

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
        options: {
            factuality: true,
            toxicity: true,
            pii: pg.PIIs.Replace,
            piiReplaceMethod: pg.ReplaceMethods.Random,
        },
    };

    var [, err] = await client.Chat(input);
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
        },
    ],
};

async function testCompletionBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Will I lose my hair',
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
    };

    var [result, err] = await client.Completion(input);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(completionResp);

    assert.equal(got, exp);
}

async function testCompletionBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Will I lose my hair',
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
    };

    var [, err] = await client.Completion(input);
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

const embeddingResp = {
    id: 'emb - 0qU4sYEutZvkHskxXwzYDgZVOhtLw',
    object: 'embedding_batch',
    created: 1717439154,
    model: 'bridgetower-large-itm-mlm-itc',
    data: [
        {
            index: 0,
            object: 'embedding',
            embedding: [0.04457271471619606],
        },
    ],
};

async function testEmbeddingBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const imageMock = {
        EncodeBase64: function () {
            return ['', null];
        },
    };

    const input = [
        {
            text: 'This is Bill Kennedy, a decent Go developer.',
            image: imageMock,
        },
    ];

    var [result, err] = await client.Embedding('bridgetower-large-itm-mlm-itc', input);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(embeddingResp);

    assert.equal(got, exp);
}

async function testEmbeddingBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const imageMock = {
        EncodeBase64: function () {
            return ['', null];
        },
    };

    const input = [
        {
            text: 'This is Bill Kennedy, a decent Go developer.',
            image: imageMock,
        },
    ];

    var [, err] = await client.Embedding('bridgetower-large-itm-mlm-itc', input);
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
        },
    ],
};

async function testFactualityBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

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
    const client = new pg.Client('http://localhost:8080', '');

    const fact =
        'The President shall receive in full for his services during the term for which he shall have been elected compensation in the aggregate amount of 400,000 a year, to be paid monthly, and in addition an expense allowance of 50,000 to assist in defraying expenses relating to or resulting from the discharge of his official duties. Any unused amount of such expense allowance shall revert to the Treasury pursuant to section 1552 of title 31, United States Code. No amount of such expense allowance shall be included in the gross income of the President. He shall be entitled also to the use of the furniture and other effects belonging to the United States and kept in the Executive Residence at the White House.';
    const text = 'The president of the united states can take a salary of one million dollars';

    var [, err] = await client.Factuality(fact, text);
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
    const client = new pg.Client('http://localhost:8080', 'any key');

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
    const client = new pg.Client('http://localhost:8080', '');

    const prompt = 'A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.';

    var [, err] = await client.Injection(prompt);
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

async function testReplacePIIBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';

    var [result, err] = await client.ReplacePII(pg.ReplaceMethods.Mask, prompt);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(replacePIResp);

    assert.equal(got, exp);
}

async function testReplacePIIBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';

    var [, err] = await client.ReplacePII(pg.ReplaceMethods.Mask, prompt);
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
        },
    ],
};

async function testToxicityBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

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
    const client = new pg.Client('http://localhost:8080', '');

    const text = 'Every flight I have is late and I am very angry. I want to hurt someone.';

    var [, err] = await client.Toxicity(text);
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
    const client = new pg.Client('http://localhost:8080', 'any key');

    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = pg.Languages.English;
    const targetLang = pg.Languages.Spanish;
    const useThirdPartyEngine = false;

    var [result, err] = await client.Translate(text, sourceLang, targetLang, useThirdPartyEngine);
    if (err != null) {
        assert.fail('ERROR:' + err.error);
    }

    const got = JSON.stringify(result);
    const exp = JSON.stringify(translateResp);

    assert.equal(got, exp);
}

async function testTranslateBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = pg.Languages.English;
    const targetLang = pg.Languages.Spanish;
    const useThirdPartyEngine = false;

    var [, err] = await client.Translate(text, sourceLang, targetLang, useThirdPartyEngine);
    if (err == null) {
        assert.fail("didn't get an error");
    }

    const got = JSON.stringify(err);
    const exp = JSON.stringify({
        error: 'api understands the request but refuses to authorize it',
    });

    assert.equal(got, exp);
}

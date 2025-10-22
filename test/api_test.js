// tests/client.test.js

import { getLocal } from 'mockttp';
import assert from 'assert';
import * as pg from '../dist/index.js';

// Use a local mock server for deterministic unit tests
const proxy = getLocal({
    cors: false,
    debug: false,
    recordTraffic: false,
});

// =============================================================================
// Mocked API Endpoints (Unit Tests)
// =============================================================================

describe('Test_Client (mocked API)', () => {
    before(async () => {
        await proxy.start(8080);

        // Helper: Authorization must be "Bearer <non-empty>"
        const isInvalidAuth = (auth) => !auth || /^Bearer\s*$/.test(auth);

        // ---------------------- Chat (incl. Vision) ----------------------
        await proxy.forPost('/chat/completions').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };

            const body = await request.body.getJson();
            if (body && body.model === 'llava-1.5-7b-hf') {
                return { statusCode: 200, json: chatVisionResp };
            }
            return { statusCode: 200, json: chatResp };
        });

        // ---------------------- Completion ----------------------
        await proxy.forPost('/completions').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };
            return { statusCode: 200, json: completionResp };
        });

        // ---------------------- Embeddings ----------------------
        await proxy.forPost('/embeddings').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };
            return { statusCode: 200, json: embeddingResp };
        });

        // ---------------------- Factuality ----------------------
        await proxy.forPost('/factuality').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };
            return { statusCode: 200, json: factualityResp };
        });

        // ---------------------- Injection ----------------------
        await proxy.forPost('/injection').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };
            return { statusCode: 200, json: injectionResp };
        });

        // ---------------------- PII Replace ----------------------
        await proxy.forPost('/PII').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };
            return { statusCode: 200, json: replacePIResp };
        });

        // ---------------------- Rerank ----------------------
        await proxy.forPost('/rerank').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };
            return { statusCode: 200, json: rerankResp };
        });

        // ---------------------- Toxicity ----------------------
        await proxy.forPost('/toxicity').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };
            return { statusCode: 200, json: toxicityResp };
        });

        // ---------------------- Translate ----------------------
        await proxy.forPost('/translate').thenCallback(async (request) => {
            const auth = request.headers['authorization'];
            if (isInvalidAuth(auth)) return { statusCode: 403 };
            return { statusCode: 200, json: translateResp };
        });
    });

    after(async () => {
        await proxy.stop();
    });

    // -------------------------------------------------------------------------
    // Chat
    // -------------------------------------------------------------------------

    it('chat-basic', async () => {
        await testChatBasic();
    });

    it('chat-multi', async () => {
        await testChatMulti();
    });

    it('chat-vision', async () => {
        await testChatVision();
    });

    it('chat-badkey', async () => {
        await testChatBadkey();
    });

    // -------------------------------------------------------------------------
    // Completion
    // -------------------------------------------------------------------------

    it('completion-basic', async () => {
        await testCompletionBasic();
    });

    it('completion-badkey', async () => {
        await testCompletionBadkey();
    });

    // -------------------------------------------------------------------------
    // Embedding
    // -------------------------------------------------------------------------

    it('embedding-basic', async () => {
        await testEmbeddingBasic();
    });

    it('embedding-badkey', async () => {
        await testEmbeddingBadkey();
    });

    // -------------------------------------------------------------------------
    // Factuality
    // -------------------------------------------------------------------------

    it('factuality-basic', async () => {
        await testFactualityBasic();
    });

    it('factuality-badkey', async () => {
        await testFactualityBadkey();
    });

    // -------------------------------------------------------------------------
    // Injection
    // -------------------------------------------------------------------------

    it('injection-basic', async () => {
        await testInjectionBasic();
    });

    it('injection-badkey', async () => {
        await testInjectionBadkey();
    });

    // -------------------------------------------------------------------------
    // Replace PII
    // -------------------------------------------------------------------------

    it('replacePI-basic', async () => {
        await testReplacePIIBasic();
    });

    it('replacePI-badkey', async () => {
        await testReplacePIIBadkey();
    });

    // -------------------------------------------------------------------------
    // Rerank
    // -------------------------------------------------------------------------

    it('rerank-basic', async () => {
        await testRerankBasic();
    });

    it('rerank-badkey', async () => {
        await testRerankBadkey();
    });

    // -------------------------------------------------------------------------
    // Toxicity
    // -------------------------------------------------------------------------

    it('toxicity-basic', async () => {
        await testToxicityBasic();
    });

    it('toxicity-badkey', async () => {
        await testToxicityBadkey();
    });

    // -------------------------------------------------------------------------
    // Translate
    // -------------------------------------------------------------------------

    it('translate-basic', async () => {
        await testTranslateBasic();
    });

    it('translate-badkey', async () => {
        await testTranslateBadkey();
    });
});

// =============================================================================
// Fixtures (mock responses)
// =============================================================================

const chatResp = {
    id: 'chat-ShL1yk0N0h1lzmrJDQCpCz3WQFQh9',
    object: 'chat.completion',
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
    object: 'chat.completion',
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

const completionResp = {
    id: 'chat-ShL1yk0N0h1lzmrJDQCpCz3WQFQh9',
    object: 'text_completion',
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

const embeddingResp = {
    id: 'emb - 0qU4sYEutZvkHskxXwzYDgZVOhtLw',
    object: 'list',
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

const factualityResp = {
    id: 'fact-GK9kueuMw0NQLc0sYEIVlkGsPH31R',
    object: 'factuality.check',
    created: 1715730425,
    checks: [
        {
            Score: 0.7879658937454224,
            Index: 0,
        },
    ],
};

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

const rerankResp = {
    id: 'rerank-67b1cdc7-bd15-4728-9482-d0d36c1b59f2',
    object: 'list',
    created: 1732232529,
    model: 'bge-reranker-v2-m3',
    results: [
        {
            index: 0,
            relevance_score: 0.06512755,
            text: 'Deep Learning is not pizza.',
        },
        {
            index: 1,
            relevance_score: 0.05439932,
            text: 'Deep Learning is pizza.',
        },
    ],
};

const toxicityResp = {
    id: 'toxi-vRvkxJHmAiSh3NvuuSc48HQ669g7y',
    object: 'toxicity.check',
    created: 1715731131,
    checks: [
        {
            Score: 0.7072361707687378,
            Index: 0,
        },
    ],
};

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

// =============================================================================
// Mocked test helpers
// =============================================================================

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

        // NOTE: legacy "options" is ignored by client, but harmless to include
        options: {
            factuality: true,
            toxicity: true,
            pii: pg.PIIs.Replace,
            piiReplaceMethod: pg.ReplaceMethods.Random,
        },
    };

    const [result, err] = await client.Chat(input);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(chatResp));
}

async function testChatMulti() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const input = {
        model: 'Neural-Chat-7B',
        messages: 'How do you feel about the world in general',
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

    const [result, err] = await client.Chat(input);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(chatResp));
}

async function testChatVision() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const imageMock = {
        EncodeBase64: () => ['', null],
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

    const [result, err] = await client.ChatVision(input);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(chatVisionResp));
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

    const [, err] = await client.Chat(input);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

async function testCompletionBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Will I lose my hair',
        maxTokens: 1000,
        temperature: 0.1,
        topP: 0.1,
    };

    const [result, err] = await client.Completion(input);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(completionResp));
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

    const [, err] = await client.Completion(input);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

async function testEmbeddingBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const imageMock = {
        EncodeBase64: () => ['', null],
    };

    const input = [
        {
            text: 'This is Bill Kennedy, a decent Go developer.',
            image: imageMock,
        },
    ];

    const [result, err] = await client.Embedding('bridgetower-large-itm-mlm-itc', input);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(embeddingResp));
}

async function testEmbeddingBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const imageMock = {
        EncodeBase64: () => ['', null],
    };

    const input = [
        {
            text: 'This is Bill Kennedy, a decent Go developer.',
            image: imageMock,
        },
    ];

    const [, err] = await client.Embedding('bridgetower-large-itm-mlm-itc', input);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

async function testFactualityBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const fact =
        'The President shall receive in full for his services during the term for which he shall have been elected compensation in the aggregate amount of 400,000 a year, to be paid monthly, and in addition an expense allowance of 50,000 to assist in defraying expenses relating to or resulting from the discharge of his official duties. Any unused amount of such expense allowance shall revert to the Treasury pursuant to section 1552 of title 31, United States Code. No amount of such expense allowance shall be included in the gross income of the President. He shall be entitled also to the use of the furniture and other effects belonging to the United States and kept in the Executive Residence at the White House.';
    const text = 'The president of the united states can take a salary of one million dollars';

    const [result, err] = await client.Factuality(fact, text);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(factualityResp));
}

async function testFactualityBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const fact =
        'The President shall receive in full for his services during the term for which he shall have been elected compensation in the aggregate amount of 400,000 a year, to be paid monthly, and in addition an expense allowance of 50,000 to assist in defraying expenses relating to or resulting from the discharge of his official duties. Any unused amount of such expense allowance shall revert to the Treasury pursuant to section 1552 of title 31, United States Code. No amount of such expense allowance shall be included in the gross income of the President. He shall be entitled also to the use of the furniture and other effects belonging to the United States and kept in the Executive Residence at the White House.';
    const text = 'The president of the united states can take a salary of one million dollars';

    const [, err] = await client.Factuality(fact, text);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

async function testInjectionBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const prompt =
        'A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.';

    const [result, err] = await client.Injection(prompt);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(injectionResp));
}

async function testInjectionBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const prompt =
        'A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.';

    const [, err] = await client.Injection(prompt);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

async function testReplacePIIBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';

    const [result, err] = await client.ReplacePII(pg.ReplaceMethods.Mask, prompt);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(replacePIResp));
}

async function testReplacePIIBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const prompt = 'My email is bill@ardanlabs.com and my number is 954-123-4567.';

    const [, err] = await client.ReplacePII(pg.ReplaceMethods.Mask, prompt);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

async function testRerankBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const input = {
        model: 'bge-reranker-v2-m3',
        query: 'What is Deep Learning?',
        documents: ['Deep Learning is not pizza.', 'Deep Learning is pizza.'],
        returnDocuments: true,
    };

    const [result, err] = await client.Rerank(input);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(rerankResp));
}

async function testRerankBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const input = {
        model: 'bge-reranker-v2-m3',
        query: 'What is Deep Learning?',
        documents: ['Deep Learning is not pizza.', 'Deep Learning is pizza.'],
        returnDocuments: true,
    };

    const [, err] = await client.Rerank(input);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

async function testToxicityBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const text = 'Every flight I have is late and I am very angry. I want to hurt someone.';

    const [result, err] = await client.Toxicity(text);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(toxicityResp));
}

async function testToxicityBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const text = 'Every flight I have is late and I am very angry. I want to hurt someone.';

    const [, err] = await client.Toxicity(text);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

async function testTranslateBasic() {
    const client = new pg.Client('http://localhost:8080', 'any key');

    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = pg.Languages.English;
    const targetLang = pg.Languages.Spanish;
    const useThirdPartyEngine = false;

    const [result, err] = await client.Translate(text, sourceLang, targetLang, useThirdPartyEngine);
    if (err != null) assert.fail('ERROR:' + err.error);

    assert.equal(JSON.stringify(result), JSON.stringify(translateResp));
}

async function testTranslateBadkey() {
    const client = new pg.Client('http://localhost:8080', '');

    const text = 'The rain in Spain stays mainly in the plain';
    const sourceLang = pg.Languages.English;
    const targetLang = pg.Languages.Spanish;
    const useThirdPartyEngine = false;

    const [, err] = await client.Translate(text, sourceLang, targetLang, useThirdPartyEngine);
    if (err == null) assert.fail("didn't get an error");

    assert.equal(
        JSON.stringify(err),
        JSON.stringify({ error: 'api understands the request but refuses to authorize it' }),
    );
}

// =============================================================================
// Quick Feature Test (Live API) - merged from provided script
// Runs only when PREDICTIONGUARD_API_KEY is set to avoid CI failures
// =============================================================================

describe('Quick Feature Test (live API, optional)', function () {
    // Live calls can take a bit longer
    this.timeout(30000);

    const apiKey = process.env.PREDICTIONGUARD_API_KEY;

    if (!apiKey) {
        it('skipped - set PREDICTIONGUARD_API_KEY to run live tests', function () {
            this.skip();
        });
        return;
    }

    const client = new pg.Client('https://api.predictionguard.com', apiKey);

    // Health endpoint can be 404 in some deployments -> skip in that case
    it('Health Check', async function () {
        const [result, err] = await client.HealthCheck();

        if (err) {
            if (typeof err.error === 'string' && /not found/i.test(err.error)) {
                this.skip(); // treat missing root health endpoint as "not applicable"
                return;
            }
            assert.fail(err.error);
        }

        assert.ok(typeof result === 'string' || result === null);
    });

    it('Advanced Chat Parameters', async () => {
        const [result, err] = await client.Chat({
            model: 'Neural-Chat-7B',
            messages: [{ role: pg.Roles.User, content: 'Say hello in 5 words' }],
            maxCompletionTokens: 20,
            temperature: 0.7,
            frequencyPenalty: 0.5,
            presencePenalty: 0.3,
            stop: ['goodbye', '\n\n'],
        });
        if (err) assert.fail(err.error);
        assert.ok(result.choices?.[0]?.message?.content?.length >= 1);
    });

    it('Function/Tool Calling', async () => {
        const [result, err] = await client.Chat({
            model: 'Neural-Chat-7B',
            messages: [{ role: pg.Roles.User, content: 'What is 15 + 27?' }],
            maxCompletionTokens: 100,
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'calculator',
                        description: 'Perform basic arithmetic',
                        parameters: {
                            type: 'object',
                            properties: {
                                operation: { type: 'string', enum: ['add', 'subtract', 'multiply', 'divide'] },
                                a: { type: 'number' },
                                b: { type: 'number' },
                            },
                            required: ['operation', 'a', 'b'],
                        },
                    },
                },
            ],
            toolChoice: 'auto',
        });
        if (err) assert.fail(err.error);
        assert.ok(result.choices?.[0]?.message);
    });

    it('Streaming Completion', async () => {
        let receivedChunks = 0;
        let fullText = '';

        const err = await client.CompletionSSE({
            model: 'Neural-Chat-7B',
            prompt: 'Count from 1 to 5:',
            maxTokens: 30,
            temperature: 0.5,
            frequencyPenalty: 0.3,
            onMessage: (event, error) => {
                if (error && error.error !== 'EOF') return;
                if (!event) return;
                receivedChunks++;
                fullText += event.choices?.[0]?.text ?? '';
            },
        });

        if (err) assert.fail(err.error);
        assert.ok(receivedChunks >= 1);
        assert.ok(fullText.length >= 1);
    });

    it('Logit Bias', async () => {
        const [result, err] = await client.Chat({
            model: 'Neural-Chat-7B',
            messages: [{ role: pg.Roles.User, content: 'Give me a one word answer: yes or no?' }],
            maxCompletionTokens: 10,
            logitBias: {
                128000: 10,
                128001: -10,
            },
        });
        if (err) assert.fail(err.error);
        assert.ok(result.choices?.[0]?.message?.content?.length >= 1);
    });

    it('Audio Transcription (skips if no file)', async function () {
        const fs = await import('fs');
        if (!(fs.existsSync('./audio.wav') || fs.existsSync('./examples/audio.wav'))) {
            this.skip();
            return;
        }
        const filePath = fs.existsSync('./audio.wav') ? './audio.wav' : './examples/audio.wav';
        const [result, err] = await client.AudioTranscription({
            model: 'whisper-1',
            file: filePath,
            language: 'en',
        });
        if (err) assert.fail(err.error);
        assert.ok(result.text && result.text.length >= 0);
    });

    it('Document Extraction (skips if no file)', async function () {
        const fs = await import('fs');
        if (!(fs.existsSync('./document.pdf') || fs.existsSync('./examples/document.pdf'))) {
            this.skip();
            return;
        }
        const filePath = fs.existsSync('./document.pdf') ? './document.pdf' : './examples/document.pdf';
        const [result, err] = await client.DocumentExtract({
            file: filePath,
            enableOCR: true,
        });
        if (err) assert.fail(err.error);
        assert.ok(typeof result.title === 'string');
        assert.ok(typeof result.count === 'number');
    });
});

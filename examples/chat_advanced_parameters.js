import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function ChatWithFrequencyPenalty() {
    console.log('=== Chat with Frequency Penalty (Reduce Repetition) ===\n');

    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'List 10 different ways to stay healthy',
            },
        ],
        maxCompletionTokens: 300,
        temperature: 0.8,
        frequencyPenalty: 1.5, // Strongly penalize repeated tokens (range: -2.0 to 2.0)
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Response with high frequency penalty (less repetition):');
    console.log(result.choices[0].message.content);
}

async function ChatWithPresencePenalty() {
    console.log('\n=== Chat with Presence Penalty (Encourage New Topics) ===\n');

    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'Tell me about different types of renewable energy',
            },
        ],
        maxCompletionTokens: 300,
        temperature: 0.7,
        presencePenalty: 1.2, // Encourage introducing new topics (range: -2.0 to 2.0)
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Response with presence penalty (more topic diversity):');
    console.log(result.choices[0].message.content);
}

async function ChatWithLogitBias() {
    console.log('\n=== Chat with Logit Bias (Control Token Likelihood) ===\n');

    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'Describe a beautiful sunset',
            },
        ],
        maxCompletionTokens: 200,
        temperature: 0.7,
        logitBias: {
            // Example: bias certain tokens
            // Token IDs are model-specific - these are examples
            128000: 15, // Strongly encourage this token
            128001: -15, // Strongly discourage this token
            128002: 5, // Slightly encourage
        },
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Response with logit bias:');
    console.log(result.choices[0].message.content);
}

async function ChatWithStopSequences() {
    console.log('\n=== Chat with Stop Sequences ===\n');

    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'Write a list of programming languages:\n1.',
            },
        ],
        maxCompletionTokens: 500,
        temperature: 0.5,
        stop: ['10.', 'Summary:', '\n\n\n'], // Stop generation at these sequences
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Response (stopped at sequence):');
    console.log('1.' + result.choices[0].message.content);
}

async function ChatWithReasoningEffort() {
    console.log('\n=== Chat with Reasoning Effort (for reasoning models) ===\n');

    const input = {
        model: 'Neural-Chat-7B', // Use a reasoning model like o1 when available
        messages: [
            {
                role: pg.Roles.User,
                content: 'Solve this logic puzzle: Three friends - Alice, Bob, and Carol - each have a different pet and favorite color. Alice doesn\'t like blue. Bob has a dog. Carol\'s favorite color is not red. The person with the cat likes blue. The person with the bird likes red. What pet and color does each person have?',
            },
        ],
        maxCompletionTokens: 500,
        reasoningEffort: pg.ReasoningEffort.High, // or 'high', 'medium', 'low'
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Response:');
    console.log(result.choices[0].message.content);

    if (result.choices[0].message.reasoning) {
        console.log('\nReasoning process:');
        console.log(result.choices[0].message.reasoning);
    }
}

async function ChatWithMaxCompletionTokens() {
    console.log('\n=== Chat with Max Completion Tokens (new parameter) ===\n');

    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'Explain machine learning in detail',
            },
        ],
        maxCompletionTokens: 150, // New parameter (replaces maxTokens)
        temperature: 0.7,
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Response (limited to 150 completion tokens):');
    console.log(result.choices[0].message.content);
}

async function ChatWithCombinedParameters() {
    console.log('\n=== Chat with Combined Advanced Parameters ===\n');

    const input = {
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.System,
                content: 'You are a creative writing assistant.',
            },
            {
                role: pg.Roles.User,
                content: 'Write a creative opening paragraph for a sci-fi novel',
            },
        ],
        maxCompletionTokens: 200,
        temperature: 0.9, // High creativity
        topP: 0.95,
        topK: 50,
        frequencyPenalty: 0.5, // Reduce some repetition
        presencePenalty: 0.8, // Encourage diverse topics
        stop: ['\n\n\n', 'Chapter 2'], // Stop sequences
        inputExtension: {
            pii: pg.PIIs.Replace,
            piiReplaceMethod: pg.ReplaceMethods.Fake,
        },
        outputExtension: {
            toxicity: true,
            factuality: false,
        },
    };

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Creative response with all parameters combined:');
    console.log(result.choices[0].message.content);
}

async function ChatMultiTurnWithAdvancedParams() {
    console.log('\n=== Multi-turn Chat with Advanced Parameters ===\n');

    const messages = [
        {
            role: pg.Roles.System,
            content: 'You are a helpful coding tutor.',
        },
        {
            role: pg.Roles.User,
            content: 'How do I reverse a string in Python?',
        },
    ];

    // First turn
    let input = {
        model: 'Neural-Chat-7B',
        messages: messages,
        maxCompletionTokens: 200,
        temperature: 0.3, // Lower for code
        frequencyPenalty: 0.2,
    };

    var [result1, err1] = await client.Chat(input);
    if (err1 != null) {
        console.log('ERROR:', err1.error);
        return;
    }

    console.log('Assistant:', result1.choices[0].message.content);

    // Add response to conversation
    messages.push({
        role: pg.Roles.Assistant,
        content: result1.choices[0].message.content,
    });

    // Second turn
    messages.push({
        role: pg.Roles.User,
        content: 'Can you show me a more advanced way using list comprehension?',
    });

    input.messages = messages;

    var [result2, err2] = await client.Chat(input);
    if (err2 != null) {
        console.log('ERROR:', err2.error);
        return;
    }

    console.log('\nUser: Can you show me a more advanced way using list comprehension?');
    console.log('Assistant:', result2.choices[0].message.content);
}

// Run examples
console.log('Advanced Chat Parameters Examples');
console.log('=================================\n');

ChatWithFrequencyPenalty()
    .then(() => ChatWithPresencePenalty())
    .then(() => ChatWithLogitBias())
    .then(() => ChatWithStopSequences())
    .then(() => ChatWithReasoningEffort())
    .then(() => ChatWithMaxCompletionTokens())
    .then(() => ChatWithCombinedParameters())
    .then(() => ChatMultiTurnWithAdvancedParams())
    .catch(console.error);

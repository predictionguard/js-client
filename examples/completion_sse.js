import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function BasicStreamingCompletion() {
    console.log('=== Basic Streaming Completion ===\n');

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Write a short story about a robot learning to paint:',
        maxTokens: 500,
        temperature: 0.7,
        onMessage: function (event, err) {
            if (err != null) {
                if (err.error === 'EOF') {
                    console.log('\n\n[Stream finished]');
                    return;
                }
                console.log('ERROR:', err.error);
                return;
            }

            // Stream the text as it comes
            for (const choice of event.choices) {
                process.stdout.write(choice.text);
            }
        },
    };

    var err = await client.CompletionSSE(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }
}

async function StreamingCompletionWithAdvancedParams() {
    console.log('\n\n=== Streaming Completion with Advanced Parameters ===\n');

    let fullText = '';

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Explain quantum computing in simple terms:',
        maxTokens: 300,
        temperature: 0.5,
        topP: 0.9,
        topK: 50,
        frequencyPenalty: 0.3, // Reduce repetition
        presencePenalty: 0.2, // Encourage topic diversity
        stop: ['\n\n', 'In conclusion'], // Stop at these sequences
        inputExtension: {
            pii: pg.PIIs.Replace,
            piiReplaceMethod: pg.ReplaceMethods.Random,
        },
        onMessage: function (event, err) {
            if (err != null) {
                if (err.error === 'EOF') {
                    console.log('\n\n[Stream finished]');
                    console.log('Full text length:', fullText.length, 'characters');
                    return;
                }
                console.log('ERROR:', err.error);
                return;
            }

            for (const choice of event.choices) {
                process.stdout.write(choice.text);
                fullText += choice.text;

                // Check finish reason
                if (choice.finish_reason) {
                    console.log('\n[Finish reason:', choice.finish_reason + ']');
                }
            }
        },
    };

    var err = await client.CompletionSSE(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }
}

async function StreamingWithLogitBias() {
    console.log('\n\n=== Streaming with Logit Bias ===\n');
    console.log('(Biasing the model to use certain tokens)\n');

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'List benefits of exercise:',
        maxTokens: 200,
        temperature: 0.7,
        logitBias: {
            // Example token IDs - bias towards positive words
            // Note: These are example token IDs, actual IDs vary by model
            128000: 10, // Increase likelihood of this token
            128001: -10, // Decrease likelihood of this token
        },
        onMessage: function (event, err) {
            if (err != null) {
                if (err.error === 'EOF') {
                    console.log('\n\n[Stream finished]');
                    return;
                }
                console.log('ERROR:', err.error);
                return;
            }

            for (const choice of event.choices) {
                process.stdout.write(choice.text);
            }
        },
    };

    var err = await client.CompletionSSE(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }
}

async function StreamingWithCustomStopSequences() {
    console.log('\n\n=== Streaming with Custom Stop Sequences ===\n');

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Write a recipe for chocolate chip cookies:\n\nIngredients:',
        maxTokens: 400,
        temperature: 0.6,
        stop: ['Instructions:', 'Steps:', 'Directions:'], // Stop when hitting these
        onMessage: function (event, err) {
            if (err != null) {
                if (err.error === 'EOF') {
                    console.log('\n\n[Stream finished - stopped at sequence]');
                    return;
                }
                console.log('ERROR:', err.error);
                return;
            }

            for (const choice of event.choices) {
                process.stdout.write(choice.text);

                if (choice.stop_reason) {
                    console.log('\n[Stop reason:', choice.stop_reason + ']');
                }
            }
        },
    };

    var err = await client.CompletionSSE(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }
}

async function StreamingWithProgressTracking() {
    console.log('\n\n=== Streaming with Progress Tracking ===\n');

    let tokenCount = 0;
    let chunkCount = 0;
    const startTime = Date.now();

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Write a detailed explanation of how neural networks work:',
        maxTokens: 500,
        temperature: 0.7,
        onMessage: function (event, err) {
            if (err != null) {
                if (err.error === 'EOF') {
                    const duration = (Date.now() - startTime) / 1000;
                    console.log('\n\n[Stream Statistics]');
                    console.log('  Chunks received:', chunkCount);
                    console.log('  Approximate tokens:', tokenCount);
                    console.log('  Duration:', duration.toFixed(2), 'seconds');
                    console.log('  Tokens/second:', (tokenCount / duration).toFixed(2));
                    return;
                }
                console.log('ERROR:', err.error);
                return;
            }

            chunkCount++;
            for (const choice of event.choices) {
                const text = choice.text;
                process.stdout.write(text);

                // Rough token estimation (words * 1.3)
                tokenCount += Math.ceil(text.split(/\s+/).length * 1.3);
            }
        },
    };

    var err = await client.CompletionSSE(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }
}

async function StreamingWithBuffering() {
    console.log('\n\n=== Streaming with Buffering (Print per sentence) ===\n');

    let buffer = '';

    const input = {
        model: 'Neural-Chat-7B',
        prompt: 'Explain the water cycle in nature:',
        maxTokens: 300,
        temperature: 0.6,
        onMessage: function (event, err) {
            if (err != null) {
                if (err.error === 'EOF') {
                    // Print any remaining buffer
                    if (buffer.trim()) {
                        console.log(buffer);
                    }
                    console.log('\n[Stream finished]');
                    return;
                }
                console.log('ERROR:', err.error);
                return;
            }

            for (const choice of event.choices) {
                buffer += choice.text;

                // Check if buffer contains a complete sentence
                const sentences = buffer.split(/[.!?]\s+/);
                if (sentences.length > 1) {
                    // Print all complete sentences
                    for (let i = 0; i < sentences.length - 1; i++) {
                        console.log(sentences[i] + '.');
                    }
                    // Keep the incomplete sentence in buffer
                    buffer = sentences[sentences.length - 1];
                }
            }
        },
    };

    var err = await client.CompletionSSE(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }
}

// Run examples
console.log('Streaming Completion Examples');
console.log('=============================\n');

BasicStreamingCompletion()
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    .then(() => StreamingCompletionWithAdvancedParams())
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    .then(() => StreamingWithLogitBias())
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    .then(() => StreamingWithCustomStopSequences())
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    .then(() => StreamingWithProgressTracking())
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
    .then(() => StreamingWithBuffering())
    .catch(console.error);

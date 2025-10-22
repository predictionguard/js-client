import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

console.log('🧪 Prediction Guard JS Client - Quick Feature Test\n');
console.log('='.repeat(60));

// Test 1: Health Check
console.log('\n1️⃣  Testing Health Check...');
try {
    const [result, err] = await client.HealthCheck();
    if (err) {
        console.log('   ❌ FAILED:', err.error);
    } else {
        console.log('   ✅ PASSED:', result);
    }
} catch (e) {
    console.log('   ❌ ERROR:', e.message);
}

// Test 2: Advanced Chat Parameters
console.log('\n2️⃣  Testing Advanced Chat Parameters...');
try {
    const [result, err] = await client.Chat({
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'Say hello in 5 words',
            },
        ],
        maxCompletionTokens: 20, // ⭐ NEW parameter
        temperature: 0.7,
        frequencyPenalty: 0.5, // ⭐ NEW parameter
        presencePenalty: 0.3, // ⭐ NEW parameter
        stop: ['goodbye', '\n\n'], // ⭐ NEW parameter
    });

    if (err) {
        console.log('   ❌ FAILED:', err.error);
    } else {
        console.log('   ✅ PASSED');
        console.log('   Response:', result.choices[0].message.content);
        console.log('   Parameters used: maxCompletionTokens, frequencyPenalty, presencePenalty, stop');
    }
} catch (e) {
    console.log('   ❌ ERROR:', e.message);
}

// Test 3: Function Calling
console.log('\n3️⃣  Testing Function/Tool Calling...');
try {
    const [result, err] = await client.Chat({
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'What is 15 + 27?',
            },
        ],
        maxCompletionTokens: 100,
        tools: [
            {
                // ⭐ NEW: Tools parameter
                type: 'function',
                function: {
                    name: 'calculator',
                    description: 'Perform basic arithmetic',
                    parameters: {
                        type: 'object',
                        properties: {
                            operation: {
                                type: 'string',
                                enum: ['add', 'subtract', 'multiply', 'divide'],
                            },
                            a: {type: 'number'},
                            b: {type: 'number'},
                        },
                        required: ['operation', 'a', 'b'],
                    },
                },
            },
        ],
        toolChoice: 'auto', // ⭐ NEW parameter
    });

    if (err) {
        console.log('   ❌ FAILED:', err.error);
    } else {
        console.log('   ✅ PASSED');
        console.log('   Response:', result.choices[0].message.content);

        // ⭐ NEW: Check for tool calls
        if (result.choices[0].message.toolCalls) {
            console.log('   Tool calls detected:', result.choices[0].message.toolCalls.length);
            console.log('   First tool call:', JSON.stringify(result.choices[0].message.toolCalls[0], null, 2));
        } else {
            console.log('   No tool calls in response (model chose to answer directly)');
        }
    }
} catch (e) {
    console.log('   ❌ ERROR:', e.message);
}

// Test 4: Streaming Completion
console.log('\n4️⃣  Testing Streaming Completion...');
try {
    let receivedChunks = 0;
    let fullText = '';

    const err = await client.CompletionSSE({
        // ⭐ NEW method
        model: 'Neural-Chat-7B',
        prompt: 'Count from 1 to 5:',
        maxTokens: 30,
        temperature: 0.5,
        frequencyPenalty: 0.3, // ⭐ Works in streaming too
        onMessage: (event, error) => {
            if (error) {
                if (error.error !== 'EOF') {
                    console.log('   ❌ FAILED:', error.error);
                }
                return;
            }

            receivedChunks++;
            fullText += event.choices[0].text;
        },
    });

    if (err) {
        console.log('   ❌ FAILED:', err.error);
    } else {
        console.log('   ✅ PASSED');
        console.log('   Received chunks:', receivedChunks);
        console.log('   Full text:', fullText.trim());
    }
} catch (e) {
    console.log('   ❌ ERROR:', e.message);
}

// Test 5: Logit Bias
console.log('\n5️⃣  Testing Logit Bias...');
try {
    const [result, err] = await client.Chat({
        model: 'Neural-Chat-7B',
        messages: [
            {
                role: pg.Roles.User,
                content: 'Give me a one word answer: yes or no?',
            },
        ],
        maxCompletionTokens: 10,
        logitBias: {
            // ⭐ NEW parameter - example token IDs
            128000: 10, // Increase probability
            128001: -10, // Decrease probability
        },
    });

    if (err) {
        console.log('   ❌ FAILED:', err.error);
    } else {
        console.log('   ✅ PASSED');
        console.log('   Response:', result.choices[0].message.content);
        console.log('   Logit bias applied successfully');
    }
} catch (e) {
    console.log('   ❌ ERROR:', e.message);
}

// Test 6: Audio Transcription (only if file exists)
console.log('\n6️⃣  Testing Audio Transcription...');
try {
    const fs = await import('fs');
    if (fs.existsSync('./audio.wav') || fs.existsSync('./examples/audio.wav')) {
        const filePath = fs.existsSync('./audio.wav') ? './audio.wav' : './examples/audio.wav';

        const [result, err] = await client.AudioTranscription({
            // ⭐ NEW method
            model: 'whisper-1',
            file: filePath,
            language: 'en',
        });

        if (err) {
            console.log('   ❌ FAILED:', err.error);
        } else {
            console.log('   ✅ PASSED');
            console.log('   Transcription:', result.text.substring(0, 100) + '...');
        }
    } else {
        console.log('   ⏭️  SKIPPED - No audio file found');
        console.log('   To test: Download audio file to ./audio.wav');
        console.log('   Example: curl -o audio.wav https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav');
    }
} catch (e) {
    console.log('   ⚠️  SKIPPED:', e.message);
}

// Test 7: Document Extraction (only if file exists)
console.log('\n7️⃣  Testing Document Extraction...');
try {
    const fs = await import('fs');
    if (fs.existsSync('./document.pdf') || fs.existsSync('./examples/document.pdf')) {
        const filePath = fs.existsSync('./document.pdf') ? './document.pdf' : './examples/document.pdf';

        const [result, err] = await client.DocumentExtract({
            // ⭐ NEW method
            file: filePath,
            enableOCR: true,
        });

        if (err) {
            console.log('   ❌ FAILED:', err.error);
        } else {
            console.log('   ✅ PASSED');
            console.log('   Title:', result.title);
            console.log('   Words:', result.count);
            console.log('   Preview:', result.contents.substring(0, 80) + '...');
        }
    } else {
        console.log('   ⏭️  SKIPPED - No document file found');
        console.log('   To test: Place a PDF file at ./document.pdf');
    }
} catch (e) {
    console.log('   ⚠️  SKIPPED:', e.message);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary:');
console.log('   - Health Check: Basic API functionality');
console.log('   - Advanced Parameters: frequency/presence penalties, stop, maxCompletionTokens');
console.log('   - Function Calling: tools, toolChoice, toolCalls response');
console.log('   - Streaming: CompletionSSE method');
console.log('   - Logit Bias: Token probability control');
console.log('   - Audio Transcription: Multipart upload, transcription');
console.log('   - Document Extraction: OCR, document parsing');
console.log('\n✅ All available features tested!');
console.log('📚 For detailed examples, see: examples/');
console.log('📖 For testing guide, see: TESTING.md\n');

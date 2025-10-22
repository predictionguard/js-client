import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function BasicTranscription() {
    console.log('=== Basic Audio Transcription ===\n');

    const input = {
        model: 'whisper-1',
        file: './audio.wav', // Path to your audio file
        language: 'en', // Optional: specify the language
        temperature: 0.0, // Lower temperature for more deterministic output
    };

    var [result, err] = await client.AudioTranscription(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Transcription:', result.text);
}

async function TranscriptionWithWordTimestamps() {
    console.log('\n=== Transcription with Word-Level Timestamps ===\n');

    const input = {
        model: 'whisper-1',
        file: './audio.wav',
        timestampGranularities: [pg.TimestampGranularity.Word],
        responseFormat: pg.AudioResponseFormat.VerboseJson,
    };

    var [result, err] = await client.AudioTranscription(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Transcription:', result.text);
    console.log('Language:', result.language);
    console.log('Duration:', result.duration, 'seconds');

    if (result.words) {
        console.log('\nWord-level timestamps:');
        result.words.slice(0, 10).forEach((word) => {
            console.log(`  ${word.start.toFixed(2)}s - ${word.end.toFixed(2)}s: "${word.text}"`);
        });
    }
}

async function TranscriptionWithSegments() {
    console.log('\n=== Transcription with Segment-Level Timestamps ===\n');

    const input = {
        model: 'whisper-1',
        file: './audio.wav',
        timestampGranularities: [pg.TimestampGranularity.Segment],
        responseFormat: pg.AudioResponseFormat.VerboseJson,
    };

    var [result, err] = await client.AudioTranscription(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Transcription:', result.text);

    if (result.segments) {
        console.log('\nSegments:');
        result.segments.forEach((segment) => {
            console.log(`  [${segment.start.toFixed(2)}s - ${segment.end.toFixed(2)}s]`);
            console.log(`  ${segment.text}`);
        });
    }
}

async function TranscriptionWithDiarization() {
    console.log('\n=== Transcription with Speaker Diarization ===\n');

    const input = {
        model: 'whisper-1',
        file: './audio.wav',
        diarization: true,
        responseFormat: pg.AudioResponseFormat.VerboseJson,
    };

    var [result, err] = await client.AudioTranscription(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Transcription:', result.text);

    if (result.segments) {
        console.log('\nSpeaker segments:');
        result.segments.forEach((segment) => {
            const speaker = segment.speaker || 'Unknown';
            console.log(`  [${speaker}] ${segment.text}`);
        });
    }
}

async function TranscriptionWithWordTimestampsAndDiarization() {
    console.log('\n=== Transcription with Both Word Timestamps and Diarization ===\n');

    const input = {
        model: 'whisper-1',
        file: './audio.wav',
        timestampGranularities: [pg.TimestampGranularity.Word, pg.TimestampGranularity.Segment],
        diarization: true,
        responseFormat: pg.AudioResponseFormat.VerboseJson,
    };

    var [result, err] = await client.AudioTranscription(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Transcription:', result.text);

    if (result.words) {
        console.log('\nWords with speakers:');
        result.words.slice(0, 20).forEach((word) => {
            const speaker = word.speaker || 'Unknown';
            console.log(`  [${speaker}] ${word.start.toFixed(2)}s: "${word.text}"`);
        });
    }
}

async function TranscriptionWithGuidedPrompt() {
    console.log('\n=== Transcription with Guided Prompt ===\n');

    const input = {
        model: 'whisper-1',
        file: './audio.wav',
        prompt: 'This is a technical discussion about artificial intelligence and machine learning.', // Guide the model's style
        temperature: 0.2,
    };

    var [result, err] = await client.AudioTranscription(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Transcription:', result.text);
}

async function TranscriptionWithSafetyChecks() {
    console.log('\n=== Transcription with Safety Checks ===\n');

    const input = {
        model: 'whisper-1',
        file: './audio.wav',
        toxicity: true, // Check for toxic content
        pii: 'replace', // Replace PII
        replaceMethod: 'mask', // How to replace PII
        injection: true, // Check for prompt injection
    };

    var [result, err] = await client.AudioTranscription(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Transcription (with PII masked):', result.text);
}

// Note: Make sure you have an audio file at ./audio.wav before running
// You can download a sample from: https://www2.cs.uic.edu/~i101/SoundFiles/

// Run examples
BasicTranscription()
    .then(() => TranscriptionWithWordTimestamps())
    .then(() => TranscriptionWithSegments())
    .then(() => TranscriptionWithDiarization())
    .then(() => TranscriptionWithWordTimestampsAndDiarization())
    .then(() => TranscriptionWithGuidedPrompt())
    .then(() => TranscriptionWithSafetyChecks())
    .catch(console.error);

import * as pg from '../dist/index.js';

const client = new pg.Client('https://api.predictionguard.com', process.env.PREDICTIONGUARD_API_KEY);

async function BasicDocumentExtraction() {
    console.log('=== Basic Document Extraction ===\n');

    const input = {
        file: './document.pdf', // Path to your document file
    };

    var [result, err] = await client.DocumentExtract(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Document Title:', result.title);
    console.log('Word Count:', result.count);
    console.log('Content Preview:', result.contents.substring(0, 200) + '...');
}

async function DocumentExtractionWithOCR() {
    console.log('\n=== Document Extraction with OCR Enabled ===\n');

    const input = {
        file: './scanned_document.pdf',
        enableOCR: true, // Enable OCR for scanned documents or images
    };

    var [result, err] = await client.DocumentExtract(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Document Title:', result.title);
    console.log('Word Count:', result.count);
    console.log('Content:', result.contents);
}

async function DocumentExtractionWithMarkdown() {
    console.log('\n=== Document Extraction with Markdown Output ===\n');

    const input = {
        file: './document.pdf',
        outputFormat: 'markdown', // Get output in markdown format
        embedImages: true, // Include images in the output
    };

    var [result, err] = await client.DocumentExtract(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Document Title:', result.title);
    console.log('Word Count:', result.count);
    console.log('Markdown Content:');
    console.log(result.contents);
}

async function DocumentExtractionWithChunking() {
    console.log('\n=== Document Extraction with Chunking ===\n');

    const input = {
        file: './large_document.pdf',
        chunkDocument: true, // Split document into chunks
        chunkSize: 1000, // Chunk size in characters/words
        enableOCR: true,
    };

    var [result, err] = await client.DocumentExtract(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Document Title:', result.title);
    console.log('Word Count:', result.count);
    console.log('Chunked Content:');
    console.log(result.contents);
}

async function DocumentExtractionWithSafetyChecks() {
    console.log('\n=== Document Extraction with Safety Checks ===\n');

    const input = {
        file: './document.pdf',
        enableOCR: true,
        toxicity: true, // Check for toxic content
        pii: 'replace', // Replace PII (block or replace)
        replaceMethod: 'category', // How to replace PII: category, fake, mask, random
        injection: true, // Check for prompt injection
    };

    var [result, err] = await client.DocumentExtract(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Document Title:', result.title);
    console.log('Word Count:', result.count);
    console.log('Content (with PII redacted):');
    console.log(result.contents.substring(0, 500) + '...');
}

async function DocumentExtractionCompleteExample() {
    console.log('\n=== Complete Document Extraction Example ===\n');

    const input = {
        file: './contract.pdf',
        embedImages: false, // Don't include images for text-only extraction
        outputFormat: 'text', // Plain text output
        chunkDocument: true,
        chunkSize: 2000,
        enableOCR: true,
        toxicity: false,
        pii: 'replace',
        replaceMethod: 'fake', // Replace with fake but realistic data
    };

    var [result, err] = await client.DocumentExtract(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Document Analysis:');
    console.log('  Title:', result.title);
    console.log('  Total Words:', result.count);
    console.log('  Content Length:', result.contents.length, 'characters');
    console.log('\nFirst 300 characters:');
    console.log(result.contents.substring(0, 300));
}

async function ExtractFromImage() {
    console.log('\n=== Extract Text from Image ===\n');

    const input = {
        file: './screenshot.png', // Works with images too
        enableOCR: true, // OCR is essential for images
        outputFormat: 'text',
    };

    var [result, err] = await client.DocumentExtract(input);
    if (err != null) {
        console.log('ERROR:', err.error);
        return;
    }

    console.log('Extracted Text from Image:');
    console.log(result.contents);
}

// Note: Make sure you have document files before running
// Supported formats: PDF, DOCX, images (PNG, JPG, etc.)

// Run examples
console.log('Document Extraction Examples');
console.log('============================\n');

BasicDocumentExtraction()
    .then(() => DocumentExtractionWithOCR())
    .then(() => DocumentExtractionWithMarkdown())
    .then(() => DocumentExtractionWithChunking())
    .then(() => DocumentExtractionWithSafetyChecks())
    .then(() => DocumentExtractionCompleteExample())
    .then(() => ExtractFromImage())
    .catch(console.error);

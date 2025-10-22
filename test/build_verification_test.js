import * as pg from '../dist/index.js';

// Minimal test to verify the client builds and exports are correct
console.log('🔍 Testing Prediction Guard Client Imports...\n');

// Test 1: Check all exports exist
console.log('1. Checking exports...');
const exports = {
    Client: pg.Client,
    Roles: pg.Roles,
    PIIs: pg.PIIs,
    ReplaceMethods: pg.ReplaceMethods,
    Directions: pg.Directions,
    Languages: pg.Languages,
    // NEW exports
    ReasoningEffort: pg.ReasoningEffort,
    ToolChoiceOptions: pg.ToolChoiceOptions,
    TimestampGranularity: pg.TimestampGranularity,
    AudioResponseFormat: pg.AudioResponseFormat,
    ImageNetwork: pg.ImageNetwork,
    ImageFile: pg.ImageFile,
};

let allExportsPresent = true;
for (const [name, value] of Object.entries(exports)) {
    if (value === undefined) {
        console.log(`   ❌ Missing: ${name}`);
        allExportsPresent = false;
    }
}

if (allExportsPresent) {
    console.log('   ✅ All exports present');
} else {
    console.log('   ❌ Some exports missing');
    process.exit(1);
}

// Test 2: Check new enums have correct values
console.log('\n2. Checking new enum values...');

const enumTests = {
    'ReasoningEffort.Low': pg.ReasoningEffort?.Low === 'low',
    'ReasoningEffort.Medium': pg.ReasoningEffort?.Medium === 'medium',
    'ReasoningEffort.High': pg.ReasoningEffort?.High === 'high',
    'ToolChoiceOptions.None': pg.ToolChoiceOptions?.None === 'none',
    'ToolChoiceOptions.Auto': pg.ToolChoiceOptions?.Auto === 'auto',
    'ToolChoiceOptions.Required': pg.ToolChoiceOptions?.Required === 'required',
    'TimestampGranularity.Word': pg.TimestampGranularity?.Word === 'word',
    'TimestampGranularity.Segment': pg.TimestampGranularity?.Segment === 'segment',
    'AudioResponseFormat.Json': pg.AudioResponseFormat?.Json === 'json',
    'AudioResponseFormat.VerboseJson': pg.AudioResponseFormat?.VerboseJson === 'verbose_json',
};

let allEnumsCorrect = true;
for (const [test, result] of Object.entries(enumTests)) {
    if (!result) {
        console.log(`   ❌ Failed: ${test}`);
        allEnumsCorrect = false;
    }
}

if (allEnumsCorrect) {
    console.log('   ✅ All enum values correct');
} else {
    console.log('   ❌ Some enum values incorrect');
    process.exit(1);
}

// Test 3: Check Client has new methods
console.log('\n3. Checking Client methods...');

const client = new pg.Client('https://api.predictionguard.com', 'test-key');

const methods = {
    // Existing methods
    Chat: typeof client.Chat === 'function',
    ChatSSE: typeof client.ChatSSE === 'function',
    ChatVision: typeof client.ChatVision === 'function',
    Completion: typeof client.Completion === 'function',
    Embedding: typeof client.Embedding === 'function',
    Factuality: typeof client.Factuality === 'function',
    HealthCheck: typeof client.HealthCheck === 'function',
    Injection: typeof client.Injection === 'function',
    ReplacePII: typeof client.ReplacePII === 'function',
    Rerank: typeof client.Rerank === 'function',
    Toxicity: typeof client.Toxicity === 'function',
    Translate: typeof client.Translate === 'function',
    // NEW methods
    CompletionSSE: typeof client.CompletionSSE === 'function',
    AudioTranscription: typeof client.AudioTranscription === 'function',
    DocumentExtract: typeof client.DocumentExtract === 'function',
};

let allMethodsPresent = true;
for (const [name, exists] of Object.entries(methods)) {
    if (!exists) {
        console.log(`   ❌ Missing method: ${name}`);
        allMethodsPresent = false;
    }
}

if (allMethodsPresent) {
    console.log('   ✅ All methods present (15 total, 3 new)');
} else {
    console.log('   ❌ Some methods missing');
    process.exit(1);
}

// Test 4: Verify API key is set for real testing
console.log('\n4. Checking environment...');
if (process.env.PREDICTIONGUARD_API_KEY) {
    console.log('   ✅ API key is set');
    console.log('   Ready to run full tests with: node examples/test_quick.js');
} else {
    console.log('   ⚠️  API key not set');
    console.log('   Set with: export PREDICTIONGUARD_API_KEY="your-key"');
    console.log('   (Required for API tests, but build verification passed)');
}

console.log('\n✅ Build verification complete!');
console.log('📦 Package version: 0.32.0');
console.log('🎉 All new features are available!\n');
console.log('Next steps:');
console.log('  1. Set API key: export PREDICTIONGUARD_API_KEY="your-key"');
console.log('  2. Run quick test: node examples/test_quick.js');
console.log('  3. Try examples: node examples/chat_function_calling.js');
console.log('  4. Read guide: cat TESTING.md\n');

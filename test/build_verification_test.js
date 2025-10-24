// test/build_verify.js
import * as pg from '../dist/index.js';

const section = (title) => {
  console.log(`\n${title}`);
};

const fail = (msg) => {
  console.log(`   ❌ ${msg}`);
  process.exit(1);
};

const ok = (msg) => console.log(`   ✅ ${msg}`);
const warn = (msg) => console.log(`   ⚠️  ${msg}`);

// ──────────────────────────────────────────────────────────────────────────────
// 1) Exports: verify required ones; don't fail if there are extras
// ──────────────────────────────────────────────────────────────────────────────

section('🔍 Testing Prediction Guard Client Imports...\n1. Checking exports...');

const requiredExports = [
  'Client',
  'Roles',
  'PIIs',
  'ReplaceMethods',
  'Directions',
  'Languages',
  // Newer/optional – we still treat them as required for this version:
  'ReasoningEffort',
  'ToolChoiceOptions',
  'TimestampGranularity',
  'AudioResponseFormat',
  'ImageNetwork',
  'ImageFile',
];

const missingExports = requiredExports.filter((k) => typeof pg[k] === 'undefined');
if (missingExports.length) {
  missingExports.forEach((k) => console.log(`   ❌ Missing export: ${k}`));
  process.exit(1);
}
ok('All required exports present');

// Also show extra exports (informational only)
const extra = Object.keys(pg).filter((k) => !requiredExports.includes(k));
if (extra.length) {
  console.log(`   ℹ️  Extra exports detected (${extra.length}): ${extra.join(', ')}`);
}

// ──────────────────────────────────────────────────────────────────────────────
/* 2) Enums: check expected values but allow additional ones to exist.
   If an enum doesn’t exist (older build), we fail (since we marked them as required above).
*/
section('\n2. Checking enum values (allowing extras)...');

const enumSpec = {
  ReasoningEffort: { Low: 'low', Medium: 'medium', High: 'high' },
  ToolChoiceOptions: { None: 'none', Auto: 'auto', Required: 'required' },
  TimestampGranularity: { Word: 'word', Segment: 'segment' },
  AudioResponseFormat: { Json: 'json', VerboseJson: 'verbose_json' },
};

let enumFailures = 0;
for (const [enumName, expectedMap] of Object.entries(enumSpec)) {
  const obj = pg[enumName];
  if (!obj || typeof obj !== 'object') {
    console.log(`   ❌ Enum missing or invalid: ${enumName}`);
    enumFailures++;
    continue;
  }

  const missing = Object.entries(expectedMap).filter(([k, v]) => obj?.[k] !== v);
  if (missing.length) {
    for (const [k, v] of missing) {
      console.log(`   ❌ ${enumName}.${k} expected "${v}", got "${obj?.[k]}"`);
    }
    enumFailures++;
  } else {
    ok(`${enumName} values OK`);
  }

  // Informational: show extra keys, but don't fail
  const extras = Object.keys(obj).filter((k) => !(k in expectedMap));
  if (extras.length) {
    console.log(`   ℹ️  ${enumName} has extra keys: ${extras.join(', ')}`);
  }
}

if (enumFailures) {
  fail('Some enum values incorrect');
} else {
  ok('All enum values correct');
}

// ──────────────────────────────────────────────────────────────────────────────
// 3) Client methods: discover dynamically; assert a minimum set exists
// ──────────────────────────────────────────────────────────────────────────────

section('\n3. Checking Client methods dynamically...');

const client = new pg.Client('https://api.predictionguard.com', 'test-key');

// Discover available methods off the prototype (excluding constructor)
const discovered = Object.getOwnPropertyNames(pg.Client.prototype)
  .filter((n) => n !== 'constructor' && typeof client[n] === 'function')
  .sort();

const minimumRequiredMethods = [
  // Core
  'Chat', 'ChatSSE', 'ChatVision',
  'Completion', 'CompletionSSE',
  'Embedding',
  'Factuality',
  'HealthCheck',
  'Injection',
  'ReplacePII',
  'Rerank',
  'Toxicity',
  'Translate',
  'AudioTranscription',
  'DocumentExtract',
];

const missingMethods = minimumRequiredMethods.filter((m) => !discovered.includes(m));
if (missingMethods.length) {
  missingMethods.forEach((m) => console.log(`   ❌ Missing method: ${m}`));
  fail('Some required Client methods are missing');
}

ok(`All required methods present (${minimumRequiredMethods.length} minimum)`);
// Informational: show all discovered methods
console.log(`   ℹ️  Discovered methods (${discovered.length}): ${discovered.join(', ')}`);

// ──────────────────────────────────────────────────────────────────────────────
// 4) Environment check (optional live tests)
// ──────────────────────────────────────────────────────────────────────────────

section('\n4. Checking environment...');
if (process.env.PREDICTIONGUARD_API_KEY) {
  ok('API key is set');
  console.log('   Ready to run full tests with: npm test');
} else {
  warn('API key not set');
  console.log('   Set with: export PREDICTIONGUARD_API_KEY="your-key"');
  console.log('   (Required for live API tests, but build verification passed)');
}

// ──────────────────────────────────────────────────────────────────────────────
// Summary
// ──────────────────────────────────────────────────────────────────────────────

console.log('\n✅ Build verification complete!');
console.log('Next steps:');
console.log('  1. Set API key: export PREDICTIONGUARD_API_KEY="your-key"');
console.log('  2. Run quick test: npm test (or node test/integration_test.js)');
console.log('  3. Try examples: node examples/chat_function_calling.js');

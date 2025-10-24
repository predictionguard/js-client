# Prediction Guard JavaScript Client - Examples

This directory contains comprehensive examples demonstrating all features of the Prediction Guard API JavaScript client.

## Prerequisites

1. **Install the package:**
   ```bash
   npm install
   npm run build
   ```

2. **Set your API key:**
   ```bash
   export PREDICTIONGUARD_API_KEY='your-api-key-here'
   ```

## Running Examples

All examples can be run using Node.js:

```bash
node examples/example_name.js
```

## Example Files

### Basic Examples

#### **[health_check.js](health_check.js)**
Check if the Prediction Guard API is healthy.

```bash
node examples/health_check.js
```

**Features:**
- API health verification
- Basic client setup

---

#### **[chat_basic.js](chat_basic.js)**
Basic chat completion with a simple string message.

```bash
node examples/chat_basic.js
```

**Features:**
- Single string message input
- Temperature and token control
- PII replacement
- Output factuality and toxicity checking

---

#### **[chat_multi.js](chat_multi.js)**
Multi-turn conversation with message history.

```bash
node examples/chat_multi.js
```

**Features:**
- Array of messages with roles (System, User, Assistant)
- Conversation context
- Multi-turn dialogue

---

### Advanced Chat Examples

#### **[chat_advanced_parameters.js](chat_advanced_parameters.js)** ⭐ NEW
Demonstrate all advanced chat parameters.

```bash
node examples/chat_advanced_parameters.js
```

**Features:**
- **Frequency Penalty**: Reduce repetitive tokens (-2.0 to 2.0)
- **Presence Penalty**: Encourage topic diversity (-2.0 to 2.0)
- **Logit Bias**: Control specific token likelihoods
- **Stop Sequences**: Custom stop conditions (string or array)
- **Reasoning Effort**: For reasoning models (low/medium/high)
- **Max Completion Tokens**: New token limit parameter
- Multi-turn conversations with advanced params

---

#### **[chat_function_calling.js](chat_function_calling.js)** ⭐ NEW
Function/tool calling capabilities.

```bash
node examples/chat_function_calling.js
```

**Features:**
- Define custom functions the model can call
- Function parameters with JSON Schema
- Tool choice options (auto, none, required, specific function)
- Parallel tool calls
- Extract function call arguments from responses
- Reasoning field for reasoning models

**Use Cases:**
- Weather queries
- Stock price lookups
- Calculator functions
- Database queries
- API integrations

---

#### **[chat_vision.js](chat_vision.js)**
Vision capabilities with image analysis.

```bash
node examples/chat_vision.js
```

**Features:**
- Image input from URL or file
- Question answering about images
- Visual content analysis
- All advanced chat parameters supported

---

#### **[chat_sse.js](chat_sse.js)**
Streaming chat with Server-Sent Events.

```bash
node examples/chat_sse.js
```

**Features:**
- Real-time token streaming
- Callback-based message handling
- Progressive response display
- All advanced parameters supported

---

### Completion Examples

#### **[completion.js](completion.js)**
Basic text completion.

```bash
node examples/completion.js
```

**Features:**
- Prompt-based completion
- Temperature and sampling control
- PII and toxicity checking

---

#### **[completion_sse.js](completion_sse.js)** ⭐ NEW
Streaming text completion with advanced features.

```bash
node examples/completion_sse.js
```

**Features:**
- Real-time streaming completions
- Frequency and presence penalties
- Logit bias control
- Custom stop sequences
- Progress tracking
- Buffered output (e.g., per sentence)
- Token counting and timing statistics

**Examples Include:**
- Basic streaming
- Advanced parameters
- Custom stop sequences
- Progress monitoring
- Sentence-by-sentence buffering

---

### Audio Transcription ⭐ NEW

#### **[audio_transcription.js](audio_transcription.js)**
Comprehensive audio transcription examples.

```bash
node examples/audio_transcription.js
```

**Requirements:**
- Audio file (WAV, MP3, etc.) at `./audio.wav`
- Sample files: https://www2.cs.uic.edu/~i101/SoundFiles/

**Features:**
- **Basic Transcription**: Simple audio-to-text
- **Word-Level Timestamps**: Precise timing for each word
- **Segment-Level Timestamps**: Timing for phrases/sentences
- **Speaker Diarization**: Identify different speakers
- **Guided Prompts**: Improve accuracy with context
- **Safety Checks**: PII replacement, toxicity detection

**Response Formats:**
- `json`: Simple text output
- `verbose_json`: Includes timestamps and metadata

**Use Cases:**
- Meeting transcriptions
- Podcast subtitles
- Interview analysis
- Call center analytics
- Accessibility features

---

### Document Extraction ⭐ NEW

#### **[document_extraction.js](document_extraction.js)**
Extract text from documents using OCR.

```bash
node examples/document_extraction.js
```

**Requirements:**
- Document file (PDF, DOCX, PNG, JPG) at `./document.pdf`

**Features:**
- **OCR**: Extract text from scanned documents
- **Multiple Formats**: PDF, DOCX, images
- **Output Formats**: Text, Markdown, HTML
- **Image Embedding**: Include images in output
- **Document Chunking**: Split large documents
- **Safety Checks**: PII redaction, toxicity detection

**Examples Include:**
- Basic extraction
- OCR-enabled extraction
- Markdown output with images
- Document chunking for large files
- PII replacement with different methods
- Image-to-text extraction

**Use Cases:**
- Contract analysis
- Resume parsing
- Invoice processing
- Research paper extraction
- Form digitization

---

### Vector & Semantic Examples

#### **[embedding.js](embedding.js)**
Generate embeddings for text and images.

```bash
node examples/embedding.js
```

**Features:**
- Text embeddings
- Image embeddings (multimodal)
- Token array embeddings
- Truncation options (Right/Left)
- Multiple embedding models

---

#### **[rerank.js](rerank.js)**
Semantic relevance ranking.

```bash
node examples/rerank.js
```

**Features:**
- Rank documents by relevance
- Query-based semantic search
- Relevance scores
- Optional document return

---

### Safety & Validation Examples

#### **[factuality.js](factuality.js)**
Check factual accuracy against reference text.

```bash
node examples/factuality.js
```

**Features:**
- Compare text to reference
- Factuality scoring
- Verify claims

---

#### **[toxicity.js](toxicity.js)**
Detect toxic content.

```bash
node examples/toxicity.js
```

**Features:**
- Toxicity scoring
- Content moderation
- Safety filtering

---

#### **[injection.js](injection.js)**
Detect prompt injection attacks.

```bash
node examples/injection.js
```

**Features:**
- Prompt injection detection
- Security validation
- Attack probability scoring

---

#### **[replacepi.js](replacepi.js)**
PII detection and replacement.

```bash
node examples/replacepi.js
```

**Features:**
- Detect personal information
- Replace methods: mask, random, fake, category
- Privacy protection

---

### Utility Examples

#### **[translate.js](translate.js)**
Multi-language translation.

```bash
node examples/translate.js
```

**Features:**
- 60+ language support
- Multiple translation options
- Quality scoring
- Third-party engine support

---

## New Features Summary

### ⭐ Function/Tool Calling
- Define custom functions
- JSON Schema parameters
- Automatic function selection
- Parallel execution

### ⭐ Audio Transcription
- Word and segment timestamps
- Speaker diarization
- Multiple audio formats
- Safety checks

### ⭐ Document Extraction
- OCR for scanned docs
- Multiple output formats
- Document chunking
- Image embedding

### ⭐ Streaming Completions
- Real-time token generation
- Progress tracking
- Custom buffering

### ⭐ Advanced Parameters
- Frequency/presence penalties
- Logit bias
- Stop sequences
- Reasoning effort
- Max completion tokens

## Parameter Reference

### Common Parameters

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `model` | string | - | Model to use |
| `temperature` | number | 0.0-2.0 | Randomness (0=deterministic, 2=very random) |
| `maxCompletionTokens` | number | 1-∞ | Max tokens in response |
| `topP` | number | 0.0-1.0 | Nucleus sampling threshold |
| `topK` | number | 1-∞ | Top-k sampling size |

### Advanced Parameters ⭐ NEW

| Parameter | Type | Range | Description |
|-----------|------|-------|-------------|
| `frequencyPenalty` | number | -2.0 to 2.0 | Penalize frequent tokens |
| `presencePenalty` | number | -2.0 to 2.0 | Penalize present tokens |
| `logitBias` | object | -100 to 100 | Token likelihood adjustment |
| `stop` | string/array | - | Stop sequences |
| `reasoningEffort` | string | low/medium/high | Reasoning model effort |
| `tools` | array | - | Available functions |
| `toolChoice` | string/object | - | Tool selection strategy |

### Safety Parameters

| Parameter | Type | Options | Description |
|-----------|------|---------|-------------|
| `pii` | string | block/replace | PII handling |
| `piiReplaceMethod` | string | mask/random/fake/category | How to replace PII |
| `factuality` | boolean | - | Check factual accuracy |
| `toxicity` | boolean | - | Check for toxic content |
| `blockPromptInjection` | boolean | - | Detect injection attacks |

## Best Practices

### 1. Temperature Settings
- **0.0-0.3**: Factual, deterministic (code, data extraction)
- **0.4-0.7**: Balanced (chat, Q&A)
- **0.8-1.0**: Creative (stories, brainstorming)
- **1.0+**: Highly creative (experimental)

### 2. Penalty Usage
- Use **frequency penalty** to reduce repetition
- Use **presence penalty** to encourage topic diversity
- Combine both for varied, non-repetitive output

### 3. Safety Checks
- Enable PII replacement for sensitive data
- Use toxicity checking for user-facing content
- Enable injection detection for untrusted prompts

### 4. Token Limits
- Use `maxCompletionTokens` instead of deprecated `maxTokens`
- Account for prompt tokens in total budget
- Monitor token usage for cost control

### 5. Streaming
- Use SSE for real-time user feedback
- Implement proper error handling for EOF
- Consider buffering for smoother display

## Common Issues & Solutions

### Issue: TypeScript Errors
**Solution**: The codebase uses strict null checking. These warnings are pre-existing and don't affect runtime:
```bash
# Option 1: Install types
npm install --save-dev @types/node

# Option 2: Disable strictNullChecks temporarily in tsconfig.json
```

### Issue: Audio/Document Files Not Found
**Solution**: Ensure files exist at the specified paths:
```bash
# Download sample audio
wget https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav -O audio.wav

# Or use your own files
```

### Issue: Multipart Upload Errors
**Solution**: The `RawDoMultipartPost` method handles both File objects (browser) and file paths (Node.js) automatically.

## API Documentation

For complete API documentation, visit:
- **Official Docs**: https://docs.predictionguard.com
- **TypeDoc**: Run `npm run docs` and open `docs/index.html`

## Support

- **GitHub Issues**: https://github.com/predictionguard/js-client/issues
- **Documentation**: https://docs.predictionguard.com
- **Community**: https://discord.gg/predictionguard

## License

See the main repository LICENSE file.

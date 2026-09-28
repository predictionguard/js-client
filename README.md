# Prediction Guard JS Client

[![npm version](https://img.shields.io/npm/v/predictionguard.svg)](https://www.npmjs.com/package/predictionguard)

> [!WARNING]
> **This package is deprecated and no longer maintained.** Some features are broken or missing, and no further updates will be released. Existing versions remain available on npm, but you should migrate to an OpenAI-compatible or Anthropic-compatible client as described below.

Copyright 2024 Prediction Guard
bill@predictionguard.com

## Migrating

The Prediction Guard API is compatible with both OpenAI-style and Anthropic-style clients. Use whichever SDK matches the functionality you need, pointed at the Prediction Guard API with your existing API key.

### OpenAI-compatible (`openai`)

```bash
npm i openai
```

```js
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.PREDICTIONGUARD_API_KEY,
    baseURL: 'https://api.predictionguard.com',
});

const response = await client.chat.completions.create({
    model: '<model-name>',
    messages: [{ role: 'user', content: 'How do you feel about the world in general?' }],
    max_tokens: 1000,
});

console.log(response.choices[0].message.content);
```

### Anthropic-compatible (`@anthropic-ai/sdk`)

```bash
npm i @anthropic-ai/sdk
```

```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
    apiKey: process.env.PREDICTIONGUARD_API_KEY,
    baseURL: 'https://api.predictionguard.com',
});

const message = await client.messages.create({
    model: '<model-name>',
    max_tokens: 1000,
    messages: [{ role: 'user', content: 'How do you feel about the world in general?' }],
});

console.log(message.content);
```

## Docs

For the full list of endpoints and models, see the [Prediction Guard documentation](https://docs.predictionguard.com).

The [API documentation for this package](https://predictionguard.github.io/js-client/) remains available for reference but will not be updated.

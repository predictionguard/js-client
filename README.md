# Prediction Guard JS Client

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/Cy6tWW4wpE69Ftb8vdTAN9/5WXNdoLm44kpG8i27QSZtA/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/Cy6tWW4wpE69Ftb8vdTAN9/5WXNdoLm44kpG8i27QSZtA/tree/main)
[![npm version](https://img.shields.io/npm/v/predictionguard.svg)](https://www.npmjs.com/package/predictionguard)

Copyright 2024 Prediction Guard
bill@predictionguard.com

### Description

This package provides functionality developed to simplify interfacing with [Prediction Guard API](https://www.predictionguard.com/) in JavaScript.

### Requirements

To access the API, contact us [here](https://mailchi.mp/predictionguard/getting-started) to get an enterprise access token. You will need this access token to continue.

### Usage

**Install Package**

```bash
$ npm i predictionguard
```

**Code Example**

```js
import * as pg from 'predictionguard';

const client = new pg.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Chat() {
    const input = {
        model: pg.Models.NeuralChat7B,
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

    var [result, err] = await client.Chat(input);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.createdDate() + ': ' + result.model + ': ' + result.choices[0].message.content);
}

Chat();
```

### Advanced Features

This client supports all Prediction Guard API features including:

**Chat & Completions:**
- Streaming completions with Server-Sent Events (SSE)
- Function/tool calling with JSON Schema
- Advanced parameters: frequency penalty, presence penalty, logit bias, stop sequences
- Reasoning models with configurable effort levels

**Audio & Documents:**
- Audio transcription with timestamps and speaker diarization
- Document extraction with OCR support

**Example Usage:**

```js
// Streaming completion
await client.CompletionSSE({
    model: 'Neural-Chat-7B',
    prompt: 'Count to 10',
    maxTokens: 100,
    onMessage: (event, err) => {
        if (err) return;
        process.stdout.write(event.choices[0].text);
    }
});

// Function calling
const [result, err] = await client.Chat({
    model: 'Neural-Chat-7B',
    messages: [{ role: pg.Roles.User, content: 'What is 25 * 4?' }],
    tools: [{
        type: 'function',
        function: {
            name: 'calculator',
            description: 'Perform calculations',
            parameters: {
                type: 'object',
                properties: {
                    operation: { type: 'string' },
                    a: { type: 'number' },
                    b: { type: 'number' }
                }
            }
        }
    }],
    toolChoice: 'auto'
});
```

Take a look at the [examples](https://github.com/predictionguard/js-client/tree/main/examples) directory for more examples.

### Docs

You can find the SDK and Prediction Guard docs using these links.

[SDK Docs](https://predictionguard.github.io/js-client)

[PG API Docs](https://docs.predictionguard.com/docs/getting-started/welcome)

### Getting started

Once you have your API key you can use the `makefile` to run curl commands for the different API endpoints.
For example, `make curl-injection` will connect to the injection endpoint and return the injection response.
The `makefile` also allows you to run the different examples such as `make js-injection` to run the Go injection example.

**Running The Project**

You will need to node before you can run the project. You can follow this [link](https://nodejs.org/en/download/package-manager) or use [brew](https://formulae.brew.sh/formula/node) which is what I do.

After you clone the repo and install node, run the install command inside the root of the project folder.

```
$ make install
```

Then run the test command to make sure everything is working.

```
$ make test
```

Finally you can try running one of the JS examples.

```
$ make js-chat-basic
```

**Testing Your Installation**

To verify all features are working correctly:

```bash
# Build verification (no API key needed)
$ node test/build_verification_test.js

# Full integration test (requires API key)
$ export PREDICTIONGUARD_API_KEY='your-key-here'
$ node test/integration_test.js
```

For detailed testing instructions, see [TESTING.md](TESTING.md).

### Licensing

```
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

Copyright 2024 Prediction Guard

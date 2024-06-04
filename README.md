# Prediction Guard JS Client

[![CircleCI](https://dl.circleci.com/status-badge/img/circleci/Cy6tWW4wpE69Ftb8vdTAN9/5WXNdoLm44kpG8i27QSZtA/tree/main.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/circleci/Cy6tWW4wpE69Ftb8vdTAN9/5WXNdoLm44kpG8i27QSZtA/tree/main)
[![npm version](https://img.shields.io/npm/v/predictionguard.svg)](https://www.npmjs.com/package/predictionguard)

Copyright 2024 Prediction Guard
bill@predictionguard.com

### Description

This package provides functionality developed to simplify interfacing with [Prediction Guard API](https://www.predictionguard.com/) in JavaScript.

### Requirements

To access the API, contact us [here](https://www.predictionguard.com/getting-started) to get an enterprise access token. You will need this access token to continue.

### Usage

**Install Package**

```
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
Take a look at the [examples](https://github.com/predictionguard/js-client/tree/main/examples) directory for more examples.

### Docs

You can find the SDK and Prediction Guard docs using these links.

[SDK Docs](https://predictionguard.github.io/js-client)

[PG API Docs](https://docs.predictionguard.com/docs/getting-started/welcome)

### Getting started

Once you have your api key you can use the `makefile` to run curl commands for the different api endpoints. For example, `make curl-injection` will connect to the injection endpoint and return the injection response. The `makefile` also allows you to run the different examples such as `make js-injection` to run the Go injection example.

** Running The Project**

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
$ make js-chat
```

#### Licensing

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

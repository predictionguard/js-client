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
import {chat} from 'predictionguard';

const client = new chat.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Chat() {
    const messages = [
        {
            role: chat.Role.User,
            content: 'How do you feel about the world in general',
        },
    ];

    var [result, err] = await client.Chat(chat.Model.NeuralChat7B, 1000, 1.1, messages);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.model + ': ' + result.choices[0].message.content);
}

Chat();
```
Take a look at the `examples` directory for more examples.

### Docs

You can find the Prediction Guard API docs on the Prediction Guard website.

[API Docs](https://docs.predictionguard.com/docs/getting-started/welcome)

[API Reference](https://docs.predictionguard.com/api-reference/api-reference/check-api-health)

### Getting started

Once you have your api key you can use the `makefile` to run curl commands for the different api endpoints. For example, `make curl-injection` will connect to the injection endpoint and return the injection response. The `makefile` also allows you to run the different examples such as `make js-injection` to run the Go injection example.

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

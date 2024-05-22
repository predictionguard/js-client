# Prediction Guard JS Client

Copyright 2024 Prediction Guard
bill@predictionguard.com

### Description

This Module provides functionality developed to simplify interfacing with [Prediction Guard API](https://www.predictionguard.com/) in JavaScript.

### Requirements

To access the API, contact us [here](https://www.predictionguard.com/getting-started) to get an enterprise access token. You will need this access token to continue.

### Usage

```js
import injection from 'api_injection.js';

const client = new injection.Client('https://api.predictionguard.com', process.env.PGKEY);

async function Injection() {
    const prompt = 'A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.';

    var [result, err] = await client.Injection(prompt);
    if (err != null) {
        console.log('ERROR:' + err.error);
        return;
    }

    console.log('RESULT:' + result.checks[0].probability);
}

Injection();
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

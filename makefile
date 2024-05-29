SHELL_PATH = /bin/ash
SHELL = $(if $(wildcard $(SHELL_PATH)),/bin/ash,/bin/bash)

install:
	npm i -g typescript eslint mocha typedoc
	npm i node-fetch@3 fetch-sse
	npm i --save-dev typescript-eslint mockttp

compile-ts:
	tsc

publish:
	npm login
	npm publish

.PHONY: docs
docs:
	typedoc --disableSources src/index.ts
	open -a "Google Chrome" docs/index.html

outdated:
	npm outdated

update:
	npm update

.PHONY: test
test:
	tsc
	npm run lint
	npm run test

# ==============================================================================
# Examples

curl-chat:
	curl -il -X POST https://api.predictionguard.com/chat/completions \
     -H "x-api-key: ${PGKEY}" \
     -H "Content-Type: application/json" \
     -d '{ \
		"model": "Neural-Chat-7B", \
		"messages": [ \
			{ \
			"role": "user", \
			"content": "How do you feel about the world in general" \
			} \
		], \
		"max_tokens": 1000, \
		"temperature": 1.1 \
	}'

js-chat: compile-ts
	node --env-file=.env examples/chat.js

curl-chat-sse:
	curl -il -X POST https://api.predictionguard.com/chat/completions \
     -H "x-api-key: ${PGKEY}" \
     -H "Content-Type: application/json" \
     -d '{ \
		"model": "Neural-Chat-7B", \
		"messages": [ \
			{ \
			"role": "user", \
			"content": "How do you feel about the world in general" \
			} \
		], \
		"stream": true \
	}'

js-chat-sse: compile-ts
	node --env-file=.env examples/chat_sse.js

curl-comp:
	curl -il -X POST https://api.predictionguard.com/completions \
     -H "x-api-key: ${PGKEY}" \
     -H "Content-Type: application/json" \
     -d '{ \
		"model": "Neural-Chat-7B", \
		"prompt": "Will I lose my hair", \
		"max_tokens": 1000, \
		"temperature": 1.1 \
	}'

js-comp: compile-ts
	node --env-file=.env examples/completion.js

curl-factuality:
	curl -X POST https://api.predictionguard.com/factuality \
     -H "x-api-key: ${PGKEY}" \
     -H "Content-Type: application/json" \
     -d '{ \
		"reference": "The President shall receive in full for his services during the term for which he shall have been elected compensation in the aggregate amount of 400,000 a year, to be paid monthly, and in addition an expense allowance of 50,000 to assist in defraying expenses relating to or resulting from the discharge of his official duties. Any unused amount of such expense allowance shall revert to the Treasury pursuant to section 1552 of title 31, United States Code. No amount of such expense allowance shall be included in the gross income of the President. He shall be entitled also to the use of the furniture and other effects belonging to the United States and kept in the Executive Residence at the White House.", \
		"text": "The president of the united states can take a salary of one million dollars" \
	}'

js-factuality: compile-ts
	node --env-file=.env examples/factuality.js

curl-health:
	curl -il https://api.predictionguard.com \
     -H "x-api-key: ${PGKEY}"

js-health: compile-ts
	node --env-file=.env examples/health_check.js

curl-injection:
	curl -X POST https://api.predictionguard.com/injection \
	 -H "x-api-key: ${PGKEY}" \
     -H "Content-Type: application/json" \
     -d '{ \
		"prompt": "A short poem may be a stylistic choice or it may be that you have said what you intended to say in a more concise way.", \
		"detect": true \
	}'

js-injection: compile-ts
	node --env-file=.env examples/injection.js

curl-replacepi:
	curl -X POST https://api.predictionguard.com/PII \
     -H "x-api-key: ${PGKEY}" \
     -H "Content-Type: application/json" \
     -d '{ \
		"prompt": "My email is bill@ardanlabs.com and my number is 954-123-4567.", \
		"replace": true, \
		"replace_method": "mask" \
	}'

js-replacepi: compile-ts
	node --env-file=.env examples/replacepi.js

curl-toxicity:
	curl -X POST https://api.predictionguard.com/toxicity \
     -H "x-api-key: ${PGKEY}" \
     -H "Content-Type: application/json" \
     -d '{ \
		"text": "Every flight I have is late and I am very angry. I want to hurt someone." \
	}'

js-toxicity: compile-ts
	node --env-file=.env examples/toxicity.js

curl-translate:
	curl -X POST https://api.predictionguard.com/translate \
     -H "x-api-key: ${PGKEY}" \
     -H "Content-Type: application/json" \
     -d '{ \
		"text": "The rain in Spain stays mainly in the plain", \
		"source_lang": "eng", \
		"target_lang": "spa" \
	}'

js-translate: compile-ts
	node --env-file=.env examples/translate.js

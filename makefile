SHELL_PATH = /bin/ash
SHELL = $(if $(wildcard $(SHELL_PATH)),/bin/ash,/bin/bash)

install:
	npm install node-fetch

run:
	node --env-file=.env test.js

SHELL:=/bin/bash

dev:
	./vite/node_modules/vite/bin/vite.js --host "gally.anna.9farm.com" vite

prod:
	./vite/node_modules/vite/bin/vite.js --base "/gally" build vite

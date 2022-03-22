build-wasm:
	GOOS=js GOARCH=wasm go build -o ./public/main.wasm ./cmd/wasm

watch-css:
	npx tailwindcss -i ./static/css/tailwind.css -o ./public/main.css --watch

watch-html:
	npx browser-sync --watch

watch-wasm:
	air

build-wasm:
	GOOS=js GOARCH=wasm go build -o ./public/main.wasm ./cmd/wasm

watch-wasm:
	go run github.com/cosmtrek/air@latest

watch-css:
	npx tailwindcss -i ./static/css/tailwind.css -o ./public/main.css --watch

watch-html:
	cd public && npx browser-sync --watch .

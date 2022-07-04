build-wasm:
	GOOS=js GOARCH=wasm go build -o ./app/wasm/main.wasm ./cmd/wasm

watch-wasm:
	go run github.com/cosmtrek/air@latest

watch-css:
	npx tailwindcss -i ./app/css/__tailwind.css -o ./app/css/main.css --watch

watch-html:
	cd public && npx browser-sync --watch .

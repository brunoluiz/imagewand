build-wasm:
	GOOS=js GOARCH=wasm go build -o ./app/wasm/main-go.wasm ./cmd/wasm

build-wasm-tinygo:
	tinygo build -o app/wasm/main-tinygo.wasm -target wasm -no-debug -gc leaking ./cmd/wasm-tinygo

watch-wasm:
	go run github.com/cosmtrek/air@latest

watch-css:
	npx tailwindcss -i ./app/css/__tailwind.css -o ./app/css/main.css --watch

watch-html:
	cd public && npx browser-sync --watch .

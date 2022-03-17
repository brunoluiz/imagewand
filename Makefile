build:
	GOOS=js GOARCH=wasm go build -o ./public/main.wasm ./cmd/wasm

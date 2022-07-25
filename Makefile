build-wasm:
	GOOS=js GOARCH=wasm go build -o ./app/wasm/main-go.wasm -ldflags="-s -w" ./cmd/wasm

build-wasm-tinygo:
	tinygo build -o app/wasm/main-tinygo.wasm -target wasm -no-debug -gc leaking ./cmd/wasm

watch-wasm:
	go run github.com/cosmtrek/air@latest

watch-css:
	npx tailwindcss -i ./app/css/__tailwind.css -o ./app/css/main.css --watch

watch-html:
	cd app && npx browser-sync --watch .

benchmark:
	mkdir -p ./bench
	# go
	GOOS=js GOARCH=wasm go build -o ./bench/go.vanilla.wasm ./cmd/wasm
	GOOS=js GOARCH=wasm go build -o ./bench/go.compileropt.wasm -ldflags="-s -w" ./cmd/wasm
	wasm-opt -Oz -o ./bench/go.compileropt.optOz.wasm ./bench/go.compileropt.wasm
	wasm-opt -O4 -o ./bench/go.compileropt.optO4.wasm ./bench/go.compileropt.wasm
	# tinygo
	tinygo build -o ./bench/tinygo.wasm -target wasm ./cmd/wasm
	tinygo build -o ./bench/tinygo.compileropt.wasm -target wasm -no-debug -gc leaking ./cmd/wasm
	wasm-opt -Oz -o ./bench/tinygo.compileropt.optOz.wasm ./bench/tinygo.compileropt.wasm
	wasm-opt -O4 -o ./bench/tinygo.compileropt.optO4.wasm ./bench/tinygo.compileropt.wasm

benchmark-out:
	@cd bench && stat -f "%N,%z" *

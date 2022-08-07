<h1 align="center">ImageWand</h1>
<p align="center">Private-first image conversion within browsers, powered by WASM ✨</p>

<center>
  <img src='./cover.jpg' />
</center>

# Summary

Many image conversion websites require users to upload images to a server, which then converts it and send to the user. The problem is that images might get stored for an indefinite amount of time in these servers, which is not great for privacy. ImageWand does all the image conversion on the client-side, leveraging WebAssembly.

This project was part of my experiments with Golang & WebAssembly. It obviously have space for improvements, so please do open issues if you find that something can be improved. It can be compiled using Golang or TinyGo, although the deployed version uses Golang for now due to Vercel limitations. 

A blog post will be available soon with more learnings about the project.

# How to run locally

- Install NodeJS, Golang and TinyGo
- Run `make watch-html`
- Run `make watch-wasm` (only works for `standard` mode)
- Run `make watch-css`: required for UI changes due to Tailwind
- The content will be served at [localhost:3000](http://localhost:3000)

## Select custom binary on load (TinyGo or Golang)

When loading the application, it will try to run using `tinygo`. If you wish to use `go`, add `?t=go`. See all supported ones at [./app/js/imagewand.js](./app/js/imagewand.js).

# References

* [Go, WebAssembly, HTTP requests and Promises](https://withblue.ink/2020/10/03/go-webassembly-http-requests-and-promises.html)
* [MDN: Transferable objects](https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects)
* [Running Go in the Browser with WASM and Web Workers](https://qvault.io/golang/running-go-in-the-browser-wasm-web-workers/)
* [Using WebAssembly with Web Workers](https://www.sitepen.com/blog/using-webassembly-with-web-workers)
* [Shrink Your TinyGo WebAssembly Modules by 60%](https://www.fermyon.com/blog/optimizing-tinygo-wasm)
* [Are We Wasm Yet ? - Part 1](https://elewis.dev/are-we-wasm-yet-part-1)
* [Are We Wasm Yet ? - Part 2](https://elewis.dev/are-we-wasm-yet-part-2#heading-server-implementation)
* [Standardizing WASI: A system interface to run WebAssembly outside the web](https://hacks.mozilla.org/2019/03/standardizing-wasi-a-webassembly-system-interface/)
* [WASI](https://wasi.dev/)
* [WebAssembly Linear Memory example](https://wasmbyexample.dev/examples/webassembly-linear-memory/webassembly-linear-memory.go.en-us.html#)
* [How can I use GitHub Actions with Vercel?](https://vercel.com/support/articles/how-can-i-use-github-actions-with-vercel)

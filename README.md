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

## Select TinyGo binary on load

When loading the application, it will try to run using `standard` (at the moment: Golang binary). If you wish to use `tinygo`, add `?t=tinygo`. See all supported ones at [./app/js/imagewand.js](./app/js/imagewand.js).

# References

- https://withblue.ink/2020/10/03/go-webassembly-http-requests-and-promises.html
- https://github.com/golang/go/issues/25612
- https://stackoverflow.com/questions/67978442/go-wasm-export-functions
- https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects
- https://qvault.io/golang/running-go-in-the-browser-wasm-web-workers/
- https://www.sitepen.com/blog/using-webassembly-with-web-workers
- https://www.fermyon.com/blog/optimizing-tinygo-wasm

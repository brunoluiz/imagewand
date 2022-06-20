# ImageWand

Converts images on the browser, using Golang + WASM

# Run locally

- Run `make watch-css`
- Run `make watch-html`
- Run `make watch-wasm`

# To-do

- Publish on GH Pages or Vercel
- Understand the difference between `worker` x `standard`, as it seems `standard` is not blocking the render anymore

# References

- https://withblue.ink/2020/10/03/go-webassembly-http-requests-and-promises.html
- https://github.com/golang/go/issues/25612
- https://stackoverflow.com/questions/67978442/go-wasm-export-functions
- https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects
- https://qvault.io/golang/running-go-in-the-browser-wasm-web-workers/
- https://www.sitepen.com/blog/using-webassembly-with-web-workers

## Optimisations

- https://www.fermyon.com/blog/optimizing-tinygo-wasm

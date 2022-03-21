// Polyfill instantiateStreaming for browsers missing it
if (!WebAssembly.instantiateStreaming) {
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    return await WebAssembly.instantiate(source, importObject);
  };
}

// Create promise to handle Worker calls whilst
// module is still initialising
let wasmResolve;
let wasmReady = new Promise((resolve) => {
  wasmResolve = resolve;
});

// Handle incoming messages
self.addEventListener(
  "message",
  async (event) => {
    const { eventType, eventData, eventId } = event.data;
    switch (eventType) {
      case "INITIALISE":
        return WebAssembly.instantiateStreaming(fetch(eventData), {}).then(
          (instantiatedModule) => {
            const wasmExports = instantiatedModule.instance.exports;

            // Resolve our exports for when the messages
            // to execute functions come through
            wasmResolve(wasmExports);

            // Send back initialised message to main thread
            self.postMessage({
              eventType: "INITIALISED",
              eventData: Object.keys(wasmExports),
            });
          }
        );
      // NOTE: the part below is a hack just for Golang
      case "INITIALISE_GO_WASM":
        importScripts('./wasm_exec.js')
        const go = new self.Go();

        return WebAssembly.instantiateStreaming(
          fetch(eventData.modulePath),
          go.importObject
        ).then((instantiatedModule) => {
          // NOTE: Golang WASM compiler is not compatible with .exports at the moment
          // const wasmExports = instantiatedModule.instance.exports;
          go.run(instantiatedModule.instance); // fire and forget
          const runnable = globalThis[eventData.exportedKey]

          // Resolve our exports for when the messages
          // to execute functions come through
          wasmResolve(runnable);

          // Send back initialised message to main thread
          self.postMessage({
            eventType: "INITIALISED",
            eventData: Object.keys(runnable),
          });
        });
      // NOTE: the part below should work with any WASM module
      case "CALL":
        return wasmReady
          .then(async (wasmInstance) => {
            const method = wasmInstance[eventData.method];
            const result = await method.apply(null, eventData.arguments);
            const buf = await result.arrayBuffer();
            self.postMessage({
              eventType: "RESULT",
              eventData: buf,
              eventId: eventId,
            }, [buf]);
          })
          .catch((error) => {
            console.error(error)
            self.postMessage({
              eventType: "ERROR",
              eventData:
                "An error occured executing WASM instance function: " +
                error.toString(),
              eventId: eventId,
            });
          });
    }
  },
  false
);

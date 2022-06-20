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
      case "INIT":
        importScripts("./wasm-exec.js"); // required for Golang WASM (comes from Golang repo)
        const go = new self.Go();

        const instantiatedModule = await WebAssembly.instantiateStreaming(
          fetch(eventData.modulePath),
          go.importObject
        );

        // NOTE: Golang WASM compiler is not compatible with .exports at the moment
        // const wasmExports = instantiatedModule.instance.exports;
        go.run(instantiatedModule.instance); // fire and forget
        const runnable = globalThis[eventData.exportedKey];

        // Resolve our exports for when the messages to execute functions come through
        wasmResolve(runnable);

        // Send back initialised message to main thread
        self.postMessage({
          eventType: "INITIALISED",
          eventData: Object.keys(runnable),
        });
        return;

      case "CALL":
        return wasmReady
          .then(async (wasmInstance) => {
            const method = wasmInstance[eventData.method];
            const result = await method.apply(null, eventData.arguments);
            let buf, transferable;

            if (!!result && result.byteLength !== undefined) {
              // If it was a Uint8Array or any other buffer, try to unpack it in an ArrayBuffer
              buf = new ArrayBuffer(
                result.buffer,
                result.byteOffset,
                result.byteLength
              );

              // Use Transferable object model to just share object ownership, avoiding copies and other trickeries
              // https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects
              transferable = [buf];
            } else {
              buf = result;
              transferable = [];
            }

            self.postMessage(
              {
                eventType: "RESULT",
                eventData: buf,
                eventId: eventId,
              },
              transferable
            );
          })
          .catch((error) => {
            console.error(error);
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

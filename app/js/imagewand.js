import { wasmWorker } from "./worker-proxy.js";

// Available ImageWand modes/binary types
const InstanceType = {
  GO: "GO", // Golang
  WORKER: "WORKER", // Golang (uses a worker); This was mostly an experiment
  TINYGO: "TINYGO", // TinyGo
};

// TinyGo does not work well with strings (throws a `syscall/js.finalizeRef` error). In ImageWand case
// these could be replaced with integers (enum). There are hacks around the string usage, but it still leads
// to memory leaks https://github.com/tinygo-org/tinygo/issues/1140
export const formatGoNumber = {
  jpg: 1,
  png: 2,
  gif: 3,
  tiff: 4,
  bmp: 5,
};

export const formatToNumber = (input) => formatGoNumber[input];

export const fromURL = (href) => {
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  return ImageWand(params.get("type") || params.get("t"));
};

// Based on a t (binary type), it selects the correct wasm_exec.js and load the correct binary.
// This because TinyGo and Golang use different wasm_exec.js.
export const ImageWand = async (t) => {
  if (!t) t = InstanceType.TINYGO;

  switch (t.toUpperCase()) {
    default:
    case InstanceType.TINYGO: {
      console.log('Starting as "tinygo"');
      await import("./wasm-tinygo-exec.js");
      const go = new window.Go();

      const obj = await WebAssembly.instantiateStreaming(
        fetch("/wasm/main-tinygo.wasm"),
        go.importObject
      );
      const wasm = obj.instance;
      go.run(wasm);

      // uses the WASM binary exported functions
      return Promise.resolve(wand);
    }

    case InstanceType.STANDARD: {
      console.log('Starting as "standard"');
      await import("./wasm-go-exec.js");

      const go = new window.Go();
      const result = await WebAssembly.instantiateStreaming(
        fetch("/wasm/main-go.wasm"),
        go.importObject
      );
      const inst = result.instance;
      go.run(inst); // fire and forget

      // uses the global `wand`
      return Promise.resolve(wand);
    }

    case InstanceType.WORKER: {
      console.log('Starting as "worker"');
      await import("./wasm-go-exec.js");
      return wasmWorker("/wasm/main-go.wasm", "/js/worker.js", "wand");
    }
  }
};

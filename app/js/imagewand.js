import { wasmWorker } from "./worker-proxy.js";

const InstanceType = {
  STANDARD: "STANDARD",
  WORKER: "WORKER",
  TINYGO: "TINYGO",
};

export const fromURL = (href) => {
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  return ImageWand(params.get("type") || params.get("t"));
};

export const ImageWand = async (t) => {
  let go;
  if (!t) t = InstanceType.STANDARD;

  switch (t.toUpperCase()) {
    case InstanceType.WORKER:
      console.log('Starting as "worker"');
      await import("./wasm-go-exec.js");
      return wasmWorker("/wasm/main-go.wasm", "/js/worker.js", "wand");

    case InstanceType.TINYGO:
      console.log('Starting as "tinygo"');
      await import("./wasm-tinygo-exec.js");
      go = new window.Go();

      const obj = await WebAssembly.instantiateStreaming(
        fetch("/wasm/main-tinygo.wasm"),
        go.importObject
      );
      const wasm = obj.instance;
      go.run(wasm);

      // uses the WASM binary exported functions
      return Promise.resolve(wasm.exports);

    default:
    case InstanceType.STANDARD:
      console.log('Starting as "standard"');
      await import("./wasm-go-exec.js");

      go = new window.Go();
      const result = await WebAssembly.instantiateStreaming(
        fetch("/wasm/main-go.wasm"),
        go.importObject
      );
      const inst = result.instance;
      go.run(inst); // fire and forget

      // uses the global `wand`
      return Promise.resolve(wand);
  }
};

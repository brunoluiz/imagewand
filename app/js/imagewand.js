import { wasmWorker } from "./worker-proxy.js";

const InstanceType = {
  STANDARD: "STANDARD",
  WORKER: "WORKER_STANDARD",
  TINYGO: "TINYGO",
};

export const fromURL = (href) => {
  const url = new URL(href);
  const params = new URLSearchParams(url.search);
  return ImageWand(params.get("type") || params.get("t"));
};

export const ImageWand = async (t) => {
  let go;

  switch (t.toUpperCase()) {
    case InstanceType.WORKER:
      console.log('Starting as "worker"');
      await import("./wasm-exec.js");
      return wasmWorker("/wasm/main.wasm", "/js/worker.js", "wand");

    case InstanceType.TINYGO:
      await import("./wasm-tinygo-exec.js");
      go = new window.Go();

      let wasm;
      const obj = await WebAssembly.instantiateStreaming(
        fetch("/wasm/main-tinygo.wasm"),
        go.importObject
      );
      wasm = obj.instance;
      go.run(wasm);

      return Promise.resolve(wasm.exports);

    default:
    case InstanceType.STANDARD:
      console.log('Starting as "standard"');
      await import("./wasm-exec.js");

      go = new window.Go();
      const result = await WebAssembly.instantiateStreaming(
        fetch("/wasm/main.wasm"),
        go.importObject
      );
      const inst = result.instance;
      go.run(inst); // fire and forget

      return Promise.resolve(wand);
  }
};

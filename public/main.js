const ImageWand = async (t) => {
  switch (t) {
    case instanceType.STANDARD:
      const go = new window.Go();
      const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
      );
      const inst = result.instance;
      go.run(inst); // fire and forget
      return Promise.resolve(wand);

    case instanceType.WORKER:
      return wasmWorker("./main.wasm", "wand");

    default:
      throw new Error("ImageWand type is not supported");
  }
};

(async () => {
  const imagewand = await ImageWand(instanceType.STANDARD);
  const { ui, setState, ...controller } = Controller();
  setState(state.INITIAL);

  let buf;
  controller.onSubmit(async (e) => {
    e.preventDefault();
    setState(state.LOADING);

    // Configures a second delay so user doesn't see flickering
    setTimeout(async () => {
      // Calls Golang WASM runtime and receive HTTP response
      const format = controller.getFormat();
      const arrayBuffer = await imagewand.convertFromBlob(
        format,
        new Uint8Array(buf)
      );
      const blob = new Blob([arrayBuffer]);

      // Creates local ObjectURL, used for download and display
      const objectURL = URL.createObjectURL(blob);
      const filename = `${objectURL.split("/").at(-1)}.${format}`;
      console.log(`Converted to ${filename} ✨`);

      // Triggers download
      controller.triggerDownload(filename, objectURL);

      // Clean ObjectURL (good practice)
      URL.revokeObjectURL(objectURL);
      buf = null;

      setState(state.CONVERTED);
      setTimeout(() => setState(state.INITIAL), 5000);
    }, 1000);

    return false;
  });

  controller.onUploadedFile(async (target) => {
    const { files } = target;

    if (files && !files.length) return;

    if (files.length > 1) {
      alert("Only one image per time is allowed 👀");
      return;
    }

    if (!files[0].type.includes("image")) {
      alert("Only images are supported 👀");
      return;
    }

    buf = await files[0].arrayBuffer();
    setState(state.READY);
  });
})();

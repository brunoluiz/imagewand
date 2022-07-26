import { Controller, UIState } from "./ui.js";
import { fromURL, formatToNumber } from "./imagewand.js";

(async () => {
  const imagewand = await fromURL(window.location.href);
  const { ui, setState, ...controller } = Controller();
  setState(UIState.INITIAL);

  let buf;
  controller.onSubmit(async (e) => {
    e.preventDefault();
    setState(UIState.LOADING);

    // Configures a second delay so user doesn't see flickering
    setTimeout(async () => {
      // Calls Golang WASM runtime and receive HTTP response
      const format = controller.getFormat();
      const arrayBuffer = await imagewand.convertFromBlob(
        formatToNumber(format),
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

      setState(UIState.CONVERTED);
      setTimeout(() => setState(UIState.INITIAL), 5000);
    }, 500);

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
    setState(UIState.READY);
  });
})();

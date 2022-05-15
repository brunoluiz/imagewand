(async () => {
  const imagewand = await wasmWorker("./main.wasm", "wand");

  let buf;
  const dropzoneEl = document.querySelector("#dropzone");
  const dropzoneCopyEl = document.querySelector("#dropzone > span");
  const formatEl = document.querySelector('select[name="format"]');

  document.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();
    setDragzoneState(state.LOADING);

    // Calls Golang WASM runtime and receive HTTP response
    const arrayBuffer = await imagewand.convertFromBlob(
      formatEl.value,
      new Uint8Array(buf)
    );
    const blob = new Blob([arrayBuffer]);

    // Creates local ObjectURL, used for download and display
    const objectURL = URL.createObjectURL(blob);
    const filename = `${objectURL.split("/").at(-1)}.${formatEl.value}`;
    console.log(`Converted to ${filename} ✨`);

    // Triggers download
    document.querySelector("#output > a").href = objectURL;
    document.querySelector("#output > a").download = filename;
    document.querySelector("#output > a").click();

    // Clean ObjectURL (good practice)
    URL.revokeObjectURL(objectURL);
    setDragzoneState(state.CONVERTED);
    setTimeout(() => setDragzoneState(state.INITIAL), 5000);

    return false;
  };

  const setDragzoneState = (state) => {
    const items = Object.values(colorsState).reduce(
      (acc, item) => [...acc, ...item],
      []
    );
    dropzoneEl.classList.remove(...items);

    dropzoneCopyEl.innerHTML = copy[state];
    dropzoneEl.classList.add(...colorsState[state]);
  };

  dropzoneEl.ondragleave = () => setDragzoneState(state.INITIAL);
  dropzoneEl.ondragover = () => setDragzoneState(state.DRAG_ZONE);

  // handles dropzone
  document.querySelector("#uploader").onchange = async (el) => {
    const { files } = el.target;

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
    setDragzoneState(state.READY);
  };
})();

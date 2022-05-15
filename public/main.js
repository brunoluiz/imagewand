const state = {
  INITIAL: "INITIAL",
  DRAG_ZONE: "DRAG_ZONE",
  READY: "READY",
  LOADING: "LOADING",
  CONVERTED: "CONVERTED",
};

const copy = {
  [state.INITIAL]: "🖼️ Drop file or click to select file",
  [state.DRAG_ZONE]: "Drop file to load",
  [state.READY]: "🪄 Ready to be converted!",
  [state.LOADING]: "✨ Converting...",
  [state.CONVERTED]:
    '✅ Converted! <span class="mt-2 block">Drop or select another file to convert more</span>',
};

const colorsState = {
  [state.INITIAL]: ["border-stone-400", "bg-stone-0", "text-stone-700"],
  [state.DRAG_ZONE]: ["border-stone-700", "bg-stone-100", "text-stone-700"],
  [state.READY]: ["border-rose-700", "bg-rose-100", "text-rose-700"],
  [state.LOADING]: ["border-amber-700", "bg-amber-100", "text-amber-700"],
  [state.CONVERTED]: [
    "border-emerald-700",
    "bg-emerald-100",
    "text-emerald-700",
  ],
};

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

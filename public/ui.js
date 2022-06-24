const instanceType = {
  STANDARD: "STANDARD",
  WORKER: "WORKER",
};

const state = {
  INITIAL: "INITIAL",
  DRAG_ZONE: "DRAG_ZONE",
  READY: "READY",
  LOADING: "LOADING",
  CONVERTED: "CONVERTED",
};

const copy = {
  [state.INITIAL]: "🖼️ Drop a single image or click to select file",
  [state.DRAG_ZONE]: "Drop file to load",
  [state.READY]: "🪄 Loaded and ready to convert",
  [state.LOADING]: "✨ Converting...",
  [state.CONVERTED]:
    '✅ Converted! <span class="mt-2 block">Drop or select another file to convert more</span>',
};

const colorsState = {
  [state.INITIAL]: ["border-stone-400", "bg-stone-0", "text-stone-700"],
  [state.DRAG_ZONE]: ["border-stone-700", "bg-stone-300", "text-stone-700"],
  [state.READY]: ["border-emerald-400", "bg-stone-0", "text-emerald-700"],
  [state.LOADING]: ["border-amber-700", "bg-stone-0", "text-amber-700"],
  [state.CONVERTED]: [
    "border-emerald-700",
    "bg-emerald-100",
    "text-emerald-700",
  ],
};

const Controller = () => {
  const dropzone = document.querySelector("#dropzone");
  const dropzoneLabel = document.querySelector("#dropzone > span");
  const formatDropdown = document.querySelector('select[name="format"]');
  const submitButton = document.querySelector("#submit-btn");
  const form = document.querySelector("form");
  const uploader = document.querySelector("#uploader");

  const setState = (s) => {
    const items = Object.values(colorsState).reduce(
      (acc, item) => [...acc, ...item],
      []
    );
    dropzone.classList.remove(...items);
    dropzoneLabel.innerHTML = copy[s];
    dropzone.classList.add(...colorsState[s]);

    // handles button state
    switch (s) {
      case state.INITIAL:
      case state.DRAG_ZONE:
      case state.CONVERTED:
        uploader.value = "";
        uploader.disabled = false;
        return;
      case state.READY:
        submitButton.disabled = false;
        formatDropdown.disabled = false;
        uploader.disabled = false;
        return;
      default:
        submitButton.disabled = true;
        formatDropdown.disabled = true;
        uploader.disabled = true;
        return;
    }
  };

  dropzone.ondragleave = () => setState(state.INITIAL);
  dropzone.ondragover = () => setState(state.DRAG_ZONE);

  return {
    ui: {
      dropzone,
      dropzoneLabel,
      formatDropdown,
      submitButton,
      form,
      uploader,
    },
    setState,
    onSubmit: (cb) => {
      form.onsubmit = (e) => {
        e.preventDefault();
        cb(e);
      };
    },
    onUploadedFile: (cb) => {
      uploader.onchange = (el) => {
        cb(el.target);
      };
    },
    triggerDownload: (filename, objectURL) => {
      document.querySelector("#output > a").href = objectURL;
      document.querySelector("#output > a").download = filename;
      document.querySelector("#output > a").click();
    },
    getFormat: () => {
      return formatDropdown.value;
    },
  };
};

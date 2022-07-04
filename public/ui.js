export const UIState = {
  INITIAL: "INITIAL",
  DRAG_ZONE: "DRAG_ZONE",
  READY: "READY",
  LOADING: "LOADING",
  CONVERTED: "CONVERTED",
};

const copy = {
  [UIState.INITIAL]: "🖼️ Drop a single image or click to select file",
  [UIState.DRAG_ZONE]: "Drop file to load",
  [UIState.READY]: "🪄 Loaded and ready to convert",
  [UIState.LOADING]: "✨ Converting...",
  [UIState.CONVERTED]:
    '✅ Converted! <span class="mt-2 block">Drop or select another file to convert more</span>',
};

const colorsState = {
  [UIState.INITIAL]: ["border-stone-400", "bg-stone-0", "text-stone-700"],
  [UIState.DRAG_ZONE]: ["border-stone-700", "bg-stone-300", "text-stone-700"],
  [UIState.READY]: ["border-emerald-400", "bg-stone-0", "text-emerald-700"],
  [UIState.LOADING]: ["border-amber-700", "bg-stone-0", "text-amber-700"],
  [UIState.CONVERTED]: [
    "border-emerald-700",
    "bg-emerald-100",
    "text-emerald-700",
  ],
};

export const Controller = () => {
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
      case UIState.INITIAL:
      case UIState.DRAG_ZONE:
      case UIState.CONVERTED:
        uploader.value = "";
        uploader.disabled = false;
        return;
      case UIState.READY:
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

  dropzone.ondragleave = () => setState(UIState.INITIAL);
  dropzone.ondragover = () => setState(UIState.DRAG_ZONE);

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

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



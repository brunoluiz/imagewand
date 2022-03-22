(async () => {
  try {
    const go = new window.Go();
    const result = await WebAssembly.instantiateStreaming(
      fetch("main.wasm"),
      go.importObject
    );
    const inst = result.instance;
    go.run(inst); // fire and forget
  } catch (err) {
    console.error(err);
  }

  let buf;
  document.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();
    dragzoneLoading();

    const format = document.querySelector('select[name="format"]').value;

    // Calls Golang WASM runtime and receive HTTP response
    const res = await wand.convertFromBlob(format, new Uint8Array(buf));
    const blob = await res.blob();

    // Creates local ObjectURL, used for download and display
    const objectURL = URL.createObjectURL(blob);
    const filename = `${objectURL.split("/").at(-1)}.${format}`;
    console.log(`Converted to ${filename} ✨`);

    // Triggers download
    document.querySelector("#output > a").href = objectURL;
    document.querySelector("#output > a").download = filename;
    document.querySelector("#output > a").click();

    // Clean ObjectURL (good practice)
    URL.revokeObjectURL(objectURL);
    dragzoneConverted()

    return false;
  };

  const reset = () => {
    document.querySelector('#dropzone').classList.remove(
      'border-stone-400', 'bg-stone-0', 'text-stone-700',
      'border-stone-700', 'bg-stone-100', 'text-stone-700',
      'border-rose-700', 'bg-rose-100', 'text-rose-700',
      'border-amber-700', 'bg-amber-100', 'text-amber-700',
      'border-emerald-700', 'bg-emerald-100', 'text-emerald-700',
    )
  }

  const dragzoneReset = () => {
    reset();
    document.querySelector('#dropzone > span').innerHTML = '🖼️ Drop file or click to select file'
    document.querySelector('#dropzone').classList.add('border-stone-400', 'bg-stone-0', 'text-stone-700')
  }

  const dragzoneHover = () => {
    reset();
    document.querySelector('#dropzone > span').innerHTML = 'Drop file to load'
    document.querySelector('#dropzone').classList.add('border-stone-700', 'bg-stone-100', 'text-stone-700')
  }

  const dragzoneReady = () => {
    reset();
    document.querySelector('#dropzone > span').innerHTML = '🪄 Ready to be converted!'
    document.querySelector('#dropzone').classList.add('border-rose-700', 'bg-rose-100', 'text-rose-700');
  }

  const dragzoneLoading = () => {
    reset();
    document.querySelector('#dropzone > span').innerHTML = '✨ Converting...'
    document.querySelector('#dropzone').classList.add('border-amber-700', 'bg-amber-100', 'text-amber-700')
  }

  const dragzoneConverted = () => {
    reset();
    document.querySelector('#dropzone > span').innerHTML = '✅ Converted! <span class="mt-2 block">Drop or select another file to convert more</span>'
    document.querySelector('#dropzone').classList.add('border-emerald-700', 'bg-emerald-100', 'text-emerald-700')
    setTimeout(dragzoneReset, 5000)
  }

  document.querySelector('#dropzone').ondragleave = dragzoneReset
  document.querySelector('#dropzone').ondragover = dragzoneHover
  document.querySelector("#uploader").onchange = async (el) => {
    console.log('oi')
    const { files } = el.target;
    if (files && !files.length) return;
    buf = await files[0].arrayBuffer();
    dragzoneReady()
  };
})();

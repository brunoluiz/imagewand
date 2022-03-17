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

  let data;
  document.querySelector("#uploader").onchange = async (el) => {
    const { files } = el.target;
    if (files && !files.length) return;
    data = await files[0].arrayBuffer();
  };

  document.querySelector("form").onsubmit = async (e) => {
    e.preventDefault();

    const format = document.querySelector('select[name="format"]').value;

    // Calls Golang WASM runtime and receive HTTP response
    const res = await wand.convertFromBlob(format, new Uint8Array(data));
    const blob = await res.blob();

    // Creates local ObjectURL, used for download and display
    const objectURL = URL.createObjectURL(blob);
    const filename = `${objectURL.split("/").at(-1)}.${format}`;
    console.log(`Converted to ${filename} ✨`);

    // Injects the image into the UI
    document.querySelector("#output").style.display = "block";
    document.querySelector("#output > img").src = objectURL;
    document.querySelector("#output > a").href = objectURL;
    document.querySelector("#output > a").download = filename;

    return false;
  };
})();

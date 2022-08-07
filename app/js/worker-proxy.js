//
// This was just an experiment I had to play around web workers + WebAssembly.
// It is not an essential part of ImageWand.
//

export const wasmWorker = (modulePath, workerPath, exportedKey) => {
  // Create an object to later interact with
  const proxy = {};

  // Keep track of the messages being sent so we can resolve them correctly
  let id = 0;
  let idPromises = {};

  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath);
    worker.postMessage({
      eventType: "INIT",
      eventData: { modulePath, exportedKey },
    });

    worker.addEventListener("message", (event) => {
      const { eventType, eventData, eventId } = event.data;

      switch (eventType) {
        case "INITIALISED":
          const methods = event.data.eventData;
          methods.forEach((method) => {
            proxy[method] = function () {
              return new Promise((resolve, reject) => {
                worker.postMessage({
                  eventType: "CALL",
                  eventData: {
                    method: method,
                    arguments: Array.from(arguments), // arguments is not an array
                  },
                  eventId: id,
                });

                idPromises[id] = { resolve, reject };
                id++;
              });
            };
          });
          resolve(proxy);
          return;
        case "RESULT":
          if (eventId !== undefined && idPromises[eventId]) {
            idPromises[eventId].resolve(eventData);
            delete idPromises[eventId];
          }
          return;
        case "ERROR":
          if (eventId !== undefined && idPromises[eventId]) {
            idPromises[eventId].reject(event.data.eventData);
            delete idPromises[eventId];
          }
          return;
      }
    });

    worker.addEventListener("error", (error) => reject(error));
  });
};

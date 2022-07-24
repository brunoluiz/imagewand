package jasm

import (
	"syscall/js"
)

// global variables with some of the most common globals to avoid extra allocations
var (
	promiseJS      = js.Global().Get("Promise")
	errorJS        = js.Global().Get("Error")
	uint8ArrayJS   = js.Global().Get("Uint8Array")
	httpResponseJS = js.Global().Get("Response")
)

// Error returns a valid JS error
func Error(err error) js.Value {
	return errorJS.New(err.Error())
}

// HTTPResponse returns a valid HTTP Response
func HTTPResponse(data []byte) js.Value {
	dataJS := ArrayBuffer(data)
	return httpResponseJS.New(dataJS)
}

// ArrayBuffer returns an Array Buffer
func ArrayBuffer(data []byte) js.Value {
	dataJS := uint8ArrayJS.New(len(data))
	js.CopyBytesToJS(dataJS, data)

	return dataJS
}

// Await creates a promise which allows any async code within the WASM program.
// Without that, IO/network operations will be a blocking request and will make the
// the program go kaput.
func Await(cb func() (js.Value, error)) js.Value {
	handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		resolve := args[0]
		reject := args[1]

		// This would be the function I want to deal with
		go func() {
			res, err := cb()
			if err != nil {
				reject.Invoke(Error(err))
				return
			}

			resolve.Invoke(res)
		}()

		return nil
	})
	defer handler.Release()

	return promiseJS.New(handler)
}

// Uint8ArrayToBytes converts an incoming JS Uint8Array into Golang bytes
func Uint8ArrayToBytes(input js.Value) []byte {
	buf := make([]byte, input.Get("byteLength").Int())
	js.CopyBytesToGo(buf, input)
	return buf
}

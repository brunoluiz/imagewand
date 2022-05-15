package main

import (
	"bytes"
	"errors"
	"fmt"
	"net/http"
	"syscall/js"

	"github.com/brunoluiz/imagewand"
	"github.com/brunoluiz/imagewand/jasm"
)

func convertFromURL() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return jasm.Await(func() (js.Value, error) {
			if len(args) != 2 {
				return js.Value{}, errors.New("please specify format and blob")
			}

			format := args[0].String()
			url := args[1].String()

			res, err := http.DefaultClient.Get(url)
			if err != nil {
				return js.Value{}, err
			}
			defer res.Body.Close()

			img, err := imagewand.New(res.Body)
			if err != nil {
				return js.Value{}, err
			}

			b := bytes.NewBuffer([]byte{})
			if err := img.Convert(b, imagewand.FileFormat(format)); err != nil {
				return js.Value{}, err
			}

			return jasm.ArrayBuffer(b.Bytes()), nil
		})
	})
}

func convertFromBlob() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return jasm.Await(func() (js.Value, error) {
			if len(args) != 2 {
				return js.Value{}, errors.New("please specify format and blob")
			}

			blob := jasm.Uint8ArrayToBytes(args[1])
			format := args[0].String()

			img, err := imagewand.New(bytes.NewBuffer(blob))
			if err != nil {
				return js.Value{}, err
			}

			b := bytes.NewBuffer([]byte{})
			if err := img.Convert(b, imagewand.FileFormat(format)); err != nil {
				return js.Value{}, err
			}

			return jasm.ArrayBuffer(b.Bytes()), nil
		})
	})
}

func main() {
	fmt.Println("Starting ImageWand 🪄")

	js.Global().Set("wand", map[string]interface{}{
		"convertFromURL":  convertFromURL(),
		"convertFromBlob": convertFromBlob(),
	})
	<-make(chan bool)
}

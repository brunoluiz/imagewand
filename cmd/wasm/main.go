package main

import (
	"bytes"
	"errors"
	"syscall/js"

	"github.com/brunoluiz/imagewand"
	"github.com/brunoluiz/imagewand/jasm"
)

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
	js.Global().Set("wand", map[string]interface{}{
		"convertFromBlob": convertFromBlob(),
	})
	<-make(chan bool)
}

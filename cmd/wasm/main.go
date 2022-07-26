package main

import (
	"bytes"
	"errors"
	"syscall/js"

	"github.com/brunoluiz/imagewand"
	"github.com/brunoluiz/imagewand/jasm"
)

var fileFormatFromInt = map[int]imagewand.FileFormat{
	1: imagewand.FileFormatJPG,
	2: imagewand.FileFormatPNG,
	3: imagewand.FileFormatGIF,
	4: imagewand.FileFormatTIFF,
	5: imagewand.FileFormatBMP,
}

func convertFromBlob() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		return jasm.Await(func() (js.Value, error) {
			if len(args) != 2 {
				return js.Value{}, errors.New("please specify format and blob")
			}

			blob := jasm.Uint8ArrayToBytes(args[1])
			format := args[0].Int()

			img, err := imagewand.New(bytes.NewBuffer(blob))
			if err != nil {
				return js.Value{}, err
			}

			f, ok := fileFormatFromInt[format]
			if !ok {
				return js.Value{}, errors.New("format not supported")
			}

			b := bytes.NewBuffer([]byte{})
			if err := img.Convert(b, f); err != nil {
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

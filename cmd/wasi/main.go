package main

import (
	"bytes"

	"github.com/brunoluiz/imagewand"
)

type image []byte

var input image;
var output image;

//export reset
func reset() {
	input = []byte{}
	output = []byte{}
}

//export appendToBuffer
func appendToBuffer(i byte) {
	input = append(input, i)
}

//export getOutputSize
func getOutputSize() int {
	return len(output)
}

//export getOutputAtPos
func getOutputAtPos(i int) byte {
	return output[i]
}

var fileFormatFromInt = map[int]imagewand.FileFormat{
	1: imagewand.FileFormatJPG,
	2: imagewand.FileFormatPNG,
	3: imagewand.FileFormatGIF,
	4: imagewand.FileFormatTIFF,
	5: imagewand.FileFormatBMP,
}

//export convertFromBlob
func convertFromBlob(format int) {
	img, err := imagewand.New(bytes.NewBuffer(input))
	if err != nil {
		panic(err)
	}

	f, ok := fileFormatFromInt[format]
	if !ok {
		panic("format not supported")
	}

	b := bytes.NewBuffer([]byte{})
	if err := img.Convert(b, f); err != nil {
		panic(err)
	}

	output = b.Bytes()
	input = []byte{}
}

func main() {
}

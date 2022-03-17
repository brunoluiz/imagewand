package main

import (
	"log"
	"os"

	"github.com/brunoluiz/imagewand"
	cli "github.com/urfave/cli/v2"
)

func main() {
	var input, output string
	app := &cli.App{
		Flags: []cli.Flag{
			&cli.StringFlag{Name: "input", Required: true, Usage: "Input file", Destination: &input},
			&cli.StringFlag{Name: "output", Required: true, Usage: "Output file (with extension)", Destination: &output},
		},
		Action: func(c *cli.Context) error {
			img, err := imagewand.Open(input)
			if err != nil {
				return err
			}

			return img.Save(output)
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Println(err)
	}
}

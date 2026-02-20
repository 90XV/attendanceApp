package main

import (
	"fmt"

	"github.com/yeqown/go-qrcode/v2"
	"github.com/yeqown/go-qrcode/writer/standard"
)

func standardGen(tcr_data string) {
	qrc, err := qrcode.New(tcr_data)
	if err != nil {
		fmt.Printf("could not generate QRCode: %v", err)
		return
	}

	w, err := standard.New("./outputs/repo-qrcode.jpeg")
	if err != nil {
		fmt.Printf("standard.New failed: %v", err)
		return
	}

	if err = qrc.Save(w); err != nil {
		fmt.Printf("could not save image: %v", err)
	}
}

func main() {

	standardGen(tcr_data)
}

package main

import (
	"fmt"

	"path/filepath"

	"github.com/yeqown/go-qrcode/v2"
	"github.com/yeqown/go-qrcode/writer/standard"
)

func standardGen(tcr_data string, data_name string) {
	qrc, err := qrcode.New(tcr_data)
	if err != nil {
		fmt.Printf("could not generate QRCode: %v", err)
		return
	}

	dn_jpeg := fmt.Sprintf("%s.jpeg", data_name)
	savename := filepath.Join("outputs", dn_jpeg)

	w, err := standard.New(savename)

	if err != nil {
		fmt.Printf("standard.New failed: %v", err)
		return
	}

	if err = qrc.Save(w); err != nil {
		fmt.Printf("could not save image: %v", err)
	}
}

func scrambler() {

}

func main() {

	tcr_data := "placeholder"
	data_name := "placeholder"
	standardGen(tcr_data, data_name)
}

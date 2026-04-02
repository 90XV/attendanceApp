package main

import (
	"fmt"

	"path/filepath"

	"crypto/rand"
	"math/big"

	"github.com/yeqown/go-qrcode/v2"
	"github.com/yeqown/go-qrcode/writer/standard"
)

type TeacherCred struct {
	First_Name string
	Last_Name string
	Nickname string
	RandomID int
}

func standardGen(tc TeacherCred) {
	qrString:= fmt.Sprintf("%s %s %d",tc.First_Name, tc.Last_Name, tc.RandomID)

	qrc, err := qrcode.New(qrString)
	if err != nil {
		fmt.Printf("could not generate QRCode: %v", err)
		return
	}

	dn_jpeg := fmt.Sprintf("%s.jpeg", tc.Nickname)
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

func idgen(){
	max:= big.NewInt(99999)
	uniqueID, err := rand.Int(rand.Reader, max)
	if err != nil {
		panic(err)
	}

	fmt.Printf("%d",uniqueID)
	return
}

func main() {
	var input int
	fmt.Print("Welcome Admin. What would you like to do? \n")
	fmt.Print("(1) Log In Panel (2) View Teachers Database (3) Add a new teacher \n")

	_ , err:= fmt.Scanf("%d",&input)

	if err != nil{
		panic(err)
	}

	switch input {
		case 1: 
			fmt.Print("SELECTED: Log In Panel")
		case 2:
			fmt.Print("SELECTED: View database")
		case 3: 
			fmt.Print("SELECTED: Add a new teacher\n")
			idgen()
		default:
			fmt.Print("Enter again")
	}
	//standardGen(tcr_data, data_name)
}

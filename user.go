package main

import (
	"fmt"
)

func AddUser(tc *TeacherCred, uniqueID int) {
	fmt.Printf("Enter the first name of the Teacher")
	fmt.Scanf("%s",&tc.First_Name)

	fmt.Printf("Enter the last name of the Teacher")
	fmt.Scanf("%s",&tc.Last_Name)

	fmt.Printf("Enter the nickname")
	fmt.Scanf("%s",&tc.Nickname)
	
	tc.RandomID:=uniqueID
}
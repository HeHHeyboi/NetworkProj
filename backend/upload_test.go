package main

import (
	"fmt"
	"testing"
)

func Test_updateIMG(t *testing.T) {
	old_url := [4]string{"hello", "world", "now", "time"}
	new_url := [4]string{"world", "to", "time", "now"}
	url := test_updateIMG(old_url[:], new_url[:])
	fmt.Println(url)

	new_url2 := [2]string{"hello", "world"}
	url = test_updateIMG(old_url[:], new_url2[:])
	fmt.Println(url)

	new_url3 := []string{}
	url = test_updateIMG(old_url[:], new_url3[:])
	fmt.Println(url)
}

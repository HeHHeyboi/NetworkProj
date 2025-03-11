package auth

import (
	"fmt"
	"testing"
)

func TestHash(t *testing.T) {
	password := "p123"
	hash, err := HashPassword(&password)
	if err != nil {
		t.Fatalf("Hash Error: %v", err)
	}
	ok := ComparePassword(&password, &hash)
	if !ok {
		t.Fatalf("Password doesn't Match: %v", err)
	}
	fmt.Println("Test Success")
}

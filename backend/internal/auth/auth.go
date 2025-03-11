package auth

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password *string) (string, error) {
	if password == nil {
		return "", fmt.Errorf("Nil password")
	}
	if *password == "" {
		return "", fmt.Errorf("password required")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(*password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("Password hash Error: %v", err)
	}
	return string(hash), nil
}

func ComparePassword(password, hash *string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(*hash), []byte(*password))
	if err != nil {
		return false
	}
	return true
}

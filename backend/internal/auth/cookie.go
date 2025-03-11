package auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

var ErrInvalidValue error = errors.New("Invalid Value")

func CreateCookie(name, value, secret string) (*http.Cookie, error) {
	expireDate := time.Now().AddDate(0, 0, 7)
	encrypt, err := encryptCookie(name, value, secret)
	encodeVal := base64.URLEncoding.EncodeToString([]byte(encrypt))
	if err != nil {
		return &http.Cookie{}, err
	}
	cookie := &http.Cookie{
		Name:     name,
		Value:    encodeVal,
		Path:     "/",
		Domain:   "localhost",
		Expires:  expireDate,
		SameSite: http.SameSiteLaxMode,
		HttpOnly: false,
	}

	return cookie, nil
}

func ReadCookie(cookie *http.Cookie, secret string) (string, error) {
	value, err := base64.URLEncoding.DecodeString(cookie.Value)
	if err != nil {
		return "", err
	}

	decrypt, err := decryptCookie(cookie.Name, value, secret)
	if err != nil {
		return "", err
	}
	return string(decrypt), nil
}

func encryptCookie(name, value, secret string) (string, error) {
	block, err := aes.NewCipher([]byte(secret))
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, aesGCM.NonceSize())
	_, err = io.ReadFull(rand.Reader, nonce)
	if err != nil {
		return "", err
	}

	text := fmt.Sprintf("%s:%s", name, value)
	encrypt := aesGCM.Seal(nonce, nonce, []byte(text), nil)

	return string(encrypt), nil
}

func decryptCookie(name string, value []byte, secret string) (string, error) {
	encryptVal := value
	block, err := aes.NewCipher([]byte(secret))
	if err != nil {
		log.Fatal("block Error")
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		log.Fatal("aesGCM Error")
		return "", err
	}

	nonceSize := aesGCM.NonceSize()
	if len(encryptVal) < nonceSize {
		log.Fatal("nonceSize Error")
		return "", ErrInvalidValue
	}

	nonce := encryptVal[:nonceSize]
	ciphertext := encryptVal[nonceSize:]

	plaintext, err := aesGCM.Open(nil, []byte(nonce), []byte(ciphertext), nil)
	if err != nil {
		log.Fatal("plaintext Error", err.Error())
		return "", ErrInvalidValue
	}

	expectedName, decrypt_value, ok := strings.Cut(string(plaintext), ":")
	if !ok {
		log.Fatal("cannot cut string Error")
		return "", ErrInvalidValue
	}

	if string(expectedName) != name {
		log.Fatal("expectedName Error")
		return "", ErrInvalidValue
	}
	return string(decrypt_value), nil
}

#!/bin/bash

echo "Window Build"
GOOS=windows GOARCH=amd64 go build -o ../backend_window.exe
echo Done
sleep 1s
echo "Mac Build"
GOOS=darwin GOARCH=arm64 go build -o ../backend_mac
echo Done
sleep 1s
echo "Linux Build"
GOOS=linux GOARCH=amd64 go build -o ../backend_linux
echo Done

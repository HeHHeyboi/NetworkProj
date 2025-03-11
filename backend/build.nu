print "Window Builds"
GOOS=windows GOARCH=amd64 go build -o ../backend_window.exe
print "Done"
sleep 500ms
print "Mac Builds"
GOOS=darwin GOARCH=arm64 go build -o ../backend_mac
echo Done
sleep 500ms
echo "Linux Build"
GOOS=linux GOARCH=amd64 go build -o ../backend_linux
echo Done

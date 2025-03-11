src := $(wildcard *.go internal/*/*.go)

binWindow := ../backend_window
binMac := ../backend_mac
out := $(binWindow) $(binMac)

build: $(out)
	@echo "Build Success"

$(binWindow): $(src)
	go build -o ../backend_window

$(binMac): $(src)
	go env -w GOARCH=arm64
	go env -w GOOS=darwin
	go build -o ../backend_mac
	go env -u GOOS
	go env -u GOARCH

list:
	@echo $(src)

clean:
	nu -c "rm ../backend_*"

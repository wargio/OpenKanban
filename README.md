# Open Kanban

A simple kanban selfhosted.

Feature list:

* Tasks (with Users, Categories and Priorities)
* Comments
* Filters
* No database support

Original webui code author: https://github.com/scazzy/kanban-board

## MAIN PROBLEMS WITH THIS CODE
This README no longer works, Go the language is different, it does not allow the simple go get below.
Instead it wants you to use go install.
But that is not it, the go-assets-builder also does not work as shown below.

So to make this software WORK you must learn go first, and then update the code and THIS readme.

**As of now THIS CODE DOES NOT RUN.**

## Screenshot

![image](https://user-images.githubusercontent.com/561184/162066838-df45e389-07c4-49b8-831c-6520d0c79af8.png)

## Building

```bash
go get -v github.com/gin-gonic/gin
go get -v github.com/jessevdk/go-assets-builder

go-assets-builder -s /www -o assets.go www
go build
```

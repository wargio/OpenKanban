# Open Kanban

A simple kanban selfhosted.

Feature list:

* Tasks (with Users, Categories and Priorities)
* Comments
* Filters
* No database support

Original webui code author: https://github.com/scazzy/kanban-board

## Building

```bash
go get -v github.com/gin-gonic/gin
go get -v github.com/jessevdk/go-assets-builder

go-assets-builder -s /www -o assets.go www
go build
```
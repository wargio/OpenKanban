# Open Kanban

A simple kanban selfhosted.

Feature list:

* Tasks (with Users, Categories and Priorities)
* Comments
* Filters
* No database support

Original webui code author: https://github.com/scazzy/kanban-board

## Screenshot

![image](https://user-images.githubusercontent.com/561184/162066838-df45e389-07c4-49b8-831c-6520d0c79af8.png)

## Building

```bash
go mod download
go build
```

## Updating the www files

you will need to install [go-assets-builder](https://github.com/jessevdk/go-assets-builder)

```bash
go-assets-builder -s /www -o assets.go www
```

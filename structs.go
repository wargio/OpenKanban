// SPDX-FileCopyrightText: 2022 deroad <wargio@libero.it>
// SPDX-License-Identifier: LGPL-3.0-only

package main

type Comment struct {
	Comment string `json:"comment" binding: "required"`
	Time    uint64 `json:"time" binding: "required"`
}

type Task struct {
	Comments    []Comment `json:"comments" binding: "required"`
	Name        string    `json:"name" binding: "required"`
	Description string    `json:"description" binding: "required"`
	Type        string    `json:"type" binding: "required"`
	Priority    string    `json:"priority" binding: "required"`
	Deadline    string    `json:"deadline" binding: "required"`
	Creation    uint64    `json:"creation" binding: "required"`
	Removed     uint64    `json:"removed" binding: "required"`
}

type List struct {
	Name  string `json:"name" binding: "required"`
	Tasks []Task `json:"tasks" binding: "required"`
}

type Option struct {
	Name  string `json:"name" binding: "required"`
	Color string `json:"color" binding: "required"`
}

type KanbanData struct {
	Priorities []Option `json:"priorities" binding: "required"`
	Types      []Option `json:"types" binding: "required"`
	Users      []string `json:"users" binding: "required"`
	Lists      []List   `json:"lists" binding: "required"`
	Bin        []Task   `json:"bin" binding: "required"`
	ReadOnly   bool     `json:"readOnly" binding: "required"`
}

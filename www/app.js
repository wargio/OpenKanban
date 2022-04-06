if (!window.addEventListener) {
    window.addEventListener = window.attachEvent;
}
if (!document.addEventListener) {
    document.addEventListener = document.attachEvent;
}
if (!window.Element) {
    Element = function() {};

    var __createElement = document.createElement;
    document.createElement = function(tagName) {
        var element = __createElement(tagName);
        if (element == null) {
            return null;
        }
        for (var key in Element.prototype) {
            element[key] = Element.prototype[key];
        }
        element.addEventListener = element.attachEvent;
        return element;
    }

    var __getElementById = document.getElementById;
    document.getElementById = function(id) {
        var element = __getElementById(id);
        if (element == null) {
            return null;
        }
        for (var key in Element.prototype) {
            element[key] = Element.prototype[key];
        }
        return element;
    }
}
Array.prototype.indexOf || (Array.prototype.indexOf = function(d, e) {
    var a;
    if (null == this) throw new TypeError('"this" is null or not defined');
    var c = Object(this),
        b = c.length >>> 0;
    if (0 === b) return -1;
    a = +e || 0;
    Infinity === Math.abs(a) && (a = 0);
    if (a >= b) return -1;
    for (a = Math.max(0 <= a ? a : b - Math.abs(a), 0); a < b;) {
        if (a in c && c[a] === d) return a;
        a++
    }
    return -1
});
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback /*, thisArg*/ ) {
        var T, k;
        if (this == null) {
            throw new TypeError('this is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }
        if (arguments.length > 1) {
            T = arguments[1];
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}
Array.prototype.move = function(old_index, new_index) {
    if (new_index >= this.length) {
        new_index = this.length - 1;
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};
if (!Date.prototype.toISOString) {
    (function() {
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        Date.prototype.toISOString = function() {
            return this.getUTCFullYear() +
                '-' + pad(this.getUTCMonth() + 1) +
                '-' + pad(this.getUTCDate()) +
                'T' + pad(this.getUTCHours()) +
                ':' + pad(this.getUTCMinutes()) +
                ':' + pad(this.getUTCSeconds()) +
                '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z';
        };
    }());
};
Element.prototype.atIndex = function() {
    if (!this.parentNode) {
        return -1;
    }
    for (var i = 0; i < this.parentNode.children.length; i++) {
        if (this.parentNode.children[i] == this) {
            return i;
        }
    }
    return -1;
};
(function() {

    function now() {
        return (new Date()).getTime();
    }

    function timeISO(x) {
        return (new Date(x)).toISOString();
    }

    function copy(o) {
        return JSON.parse(JSON.stringify(o));
    }

    function live(eventType, selector, callback) {
        document.addEventListener(eventType, function(e) {
            if (e.target.matches(selector)) {
                callback.call(e.target, e);
            }
        }, false);
    };

    var ModalDialog = function(title, body, extra, ok_callback, ok_data, cancel_callback, cancel_data) {
        document.getElementById('modal-dialog-title-id').innerHTML = title;
        document.getElementById('modal-dialog-body-id').innerHTML = body;
        document.getElementById('modal-dialog-extra-id').innerHTML = '';
        if (extra) {
            document.getElementById('modal-dialog-extra-id').appendChild(extra);
        }
        ModalDialog.ok_data = ok_data;
        ModalDialog.ok_callback = ok_callback;
        ModalDialog.cancel_data = cancel_data;
        ModalDialog.cancel_callback = cancel_callback;
        if (!ok_callback) {
            document.getElementById('modal-dialog-ok-id').style.display = 'none';
        } else if (!cancel_callback) {
            document.getElementById('modal-dialog-cancel-id').style.display = 'none';
            document.getElementById('modal-dialog-ok-id').style.display = 'inline-block';
        } else {
            document.getElementById('modal-dialog-cancel-id').style.display = 'inline-block';
            document.getElementById('modal-dialog-ok-id').style.display = 'inline-block';
        }
        ModalDialog.show();
    };

    ModalDialog.show = function() {
        document.getElementById('modal-dialog').style.display = 'block';
    };

    ModalDialog.hide = function() {
        document.getElementById('modal-dialog').style.display = 'none';
    };

    document.getElementById('modal-dialog-ok-id').onclick = function() {
        if (typeof ModalDialog.ok_callback == 'function') {
            ModalDialog.ok_callback(ModalDialog.ok_data);
        }
        ModalDialog.hide();
    };

    document.getElementById('modal-dialog-cancel-id').onclick = function() {
        if (typeof ModalDialog.cancel_callback == 'function') {
            ModalDialog.cancel_callback(ModalDialog.cancel_data);
        }
        ModalDialog.hide();
    };

    // function adapterExample (array_value, is_innerhtml)
    ModalDialog.Option = function(title, body, optionlist, adapter, ok_callback) {
        var selector = document.createElement('select');
        selector.style.width = '100%';
        selector.className = 'option-task';
        selector.id = 'modal-dialog-selector';
        for (var i = 0; i < optionlist.length; i++) {
            var option = document.createElement('option');
            option.selected = (i == 0);
            if (adapter) {
                option.innerHTML = adapter(optionlist[i], true);
                option.value = adapter(optionlist[i], false);
            } else {
                option.innerHTML = optionlist[i];
                option.value = optionlist[i];
            }
            selector.appendChild(option);
        }
        ModalDialog.Option.ok_callback = ok_callback;
        ModalDialog(title, body, selector, function() {
            var selector = document.getElementById('modal-dialog-selector');
            if (ModalDialog.Option.ok_callback) {
                ModalDialog.Option.ok_callback(selector.value);
            } else {
                alert('INVALID CALLBACK');
            }
        }, null, true, null);
    };

    ModalDialog.Input = function(title, body, placeholder, ok_callback) {
        var input = document.createElement('input');
        input.id = 'modal-dialog-input';
        input.type = 'text';
        input.style.width = '100%';
        input.placeholder = placeholder ? placeholder : '';
        ModalDialog.Input.ok_callback = ok_callback;
        ModalDialog(title, body, input, function() {
            var input = document.getElementById('modal-dialog-input');
            if (ModalDialog.Input.ok_callback) {
                ModalDialog.Input.ok_callback(input.value);
            } else {
                alert('INVALID CALLBACK');
            }
        }, null, true, null);
    };

    ModalDialog.Message = function(title, body) {
        ModalDialog(title, body, null, true, null, false, null);
    };

    var AJAX = function(method, url, callback, body) {
        this.context = new XMLHttpRequest();
        var self = this.context;
        this.context.onreadystatechange = function() {
            if (self.readyState == 4) {
                if (self.status == 200) {
                    if (callback) callback(self.responseText);
                } else {
                    ModalDialog.Message('Error ' + self.status, self.responseText);
                }
            }
        };
        this.context.open(method, url, true);
        this.context.send(body);
    };

    var Type = function(data) {
        this.name = data.name;
        this.color = data.color;
        this.json = function() {
            return {
                name: this.name,
                color: this.color
            };
        };
    };

    var Task = function(data, list, index) {
        this.name = data.name;
        this.deadline = data.deadline;
        this.type = UI.taskType(data.type);
        this.priority = UI.taskPriority(data.priority);
        this.description = data.description;
        this.creationTime = data.creation ? data.creation : now();
        this.removedTime = data.removed ? data.removed : 0;
        this.comments = [];
        for (var i = 0; data.comments && i < data.comments.length; i++) {
            this.comments.push(data.comments[i]);
        }
        this.list = list;
        this.element = document.createElement("div");
        this.element.draggable = true;
        this.element.id = '#todo_' + index;
        this.element.className = 'card';
        this.element.self = this;
        this.element.ondblclick = function(e) {
            e.preventDefault();
            UI.modalShow(e.target.self);
        };
        this.is_name = function(name) {
            return name == this.name;
        };
        this.moveToList = function(list) {
            this.list.remove(this);
            list.add(this);
        };
        this.moveAtTask = function(task) {
            this.list.moveAt(this, task);
        };
        this.moveAtEnd = function(task) {
            this.list.moveAt(this);
        };
        this.updateUI = function() {
            this.element.innerHTML = "";
            var span = document.createElement("span");
            span.style.color = '#666699';
            span.className = 'task-user';
            span.innerHTML = this.name;
            span.ondblclick = function(e) {
                e.preventDefault();
                UI.modalShow(e.target.parentNode.self);
            };
            this.element.appendChild(span);
            span = document.createElement("span");
            span.style.color = this.priority.color;
            span.className = 'task-prio';
            span.innerHTML = '&nbsp;' + this.priority.name;
            span.ondblclick = function(e) {
                e.preventDefault();
                UI.modalShow(e.target.parentNode.self);
            };
            this.element.appendChild(span);
            span = document.createElement("span");
            span.style.color = this.type.color;
            span.className = 'task-type';
            span.innerHTML = '&nbsp;' + this.type.name;
            span.ondblclick = function(e) {
                e.preventDefault();
                UI.modalShow(e.target.parentNode.self);
            };
            this.element.appendChild(span);
            if (this.deadline) {
                this.element.appendChild(document.createElement("br"));
                span = document.createElement("span");
                span.style.color = '#909090';
                span.className = 'task-deadline';
                span.innerHTML = 'Deadline: ' + decodeURIComponent(this.deadline);
                span.ondblclick = function(e) {
                    e.preventDefault();
                    UI.modalShow(e.target.parentNode.self);
                };
                this.element.appendChild(span);
            }
            this.element.appendChild(document.createElement("br"));
            span = document.createElement("span");
            span.innerHTML = decodeURIComponent(this.description);
            span.ondblclick = function(e) {
                e.preventDefault();
                UI.modalShow(e.target.parentNode.self);
            };
            this.element.appendChild(span);
        };
        this.show = function() {
            this.element.style.display = 'block';
        };
        this.hide = function() {
            this.element.style.display = 'none';
        };
        this.addComment = function(comment) {
            this.comments.push({
                time: now(),
                comment: comment
            });
        };
        this.removeComment = function(index) {
            if (index > -1 && index < this.comments.length) {
                this.comments.splice(index, 1);
            }
        };
        this.json = function() {
            return {
                type: this.type.name,
                priority: this.priority.name,
                name: this.name,
                deadline: this.deadline,
                description: this.description,
                creation: this.creationTime,
                removed: this.removedTime,
                comments: copy(this.comments)
            };
        };
    };

    var List = function(name, index, tasks) {
        this.name = name;
        this.tasks = new Array(tasks ? tasks.length : 0);
        this.element = document.createElement("div");
        this.heading = document.createElement("h3");
        this.listCounter = document.createElement("span");
        this.element.id = '#list_' + index;
        this.element.self = this;
        this.element.className = "list";
        this.heading.className = "listname";
        this.update = function() {
            // contains the header when empty
            this.tasks = [];
            for (var i = 0; i < this.element.children.length; i++) {
                var t = this.element.children[i].self;
                if (t && !t.isplaceholder) {
                    t.list = this;
                    this.tasks.push(t);
                }
            }
        };
        this.filter = function(name) {
            for (var i = 0; i < this.tasks.length; i++) {
                if (!name) {
                    this.tasks[i].show();
                    continue;
                } else if (this.tasks[i].is_name(name)) {
                    this.tasks[i].show();
                } else {
                    this.tasks[i].hide();
                }
            }
        }
        this.updateUI = function() {
            this.element.innerHTML = '';
            this.heading.innerHTML = this.name;
            this.listCounter.innerHTML = '' + this.tasks.length;
            this.element.appendChild(this.heading);
            this.heading.appendChild(this.listCounter);
            for (var i = 0; i < this.tasks.length; i++) {
                this.tasks[i].updateUI();
                this.element.appendChild(this.tasks[i].element);
            }
        };
        this.moveAt = function(task0, task1) {
            var src = this.tasks.indexOf(task0);
            var dst = task1 ? this.tasks.indexOf(task1) : this.tasks.length - 1;
            this.tasks.move(src, dst);
        };
        this.add = function(task, index) {
            task.list = this;
            if (typeof index != 'number') {
                task.index = this.tasks.length;
                this.tasks.push(task);
            } else {
                task.index = index;
                this.tasks.splice(index, 0, task);
            }
        };
        this.remove = function(task) {
            var index = this.tasks.indexOf(task);
            if (index > -1) {
                task.list = null;
                return this.tasks.splice(index, 1)[0];
            }
            return null;
        };
        this.size = function() {
            return this.tasks.length;
        };
        this.json = function() {
            var j = {};
            j.name = this.name;
            j.tasks = new Array(this.tasks.length);
            for (var i = 0; i < this.tasks.length; i++) {
                j.tasks[i] = this.tasks[i].json();
            }
            return j;
        };
        for (var i = 0; i < this.tasks.length; i++, List.index++) {
            var t = tasks[i];
            this.tasks[i] = new Task(t, this, List.index);
        }
    };

    List.index = 0;

    var Placeholder = function() {
        this.element = document.createElement('div');
        this.element.className = "card-placeholder";
        this.element.self = this;
        this.before = null;
        this.isplaceholder = true;
        this.remove = function(e) {
            this.element.remove(e);
        }
        this.height = function(px) {
            this.element.style.height = px ? px : '52px';
        }
    };

    var Kanban = function() {
        this.dragging = false;
        this.readOnly = false;
        this.network = false;
        this.placeholder = new Placeholder();
        this.users = [];
        this.lists = [];
        this.types = [];
        this.priorities = [];
        this.bin = [];
        this.board = document.getElementById('board');
        this.counter = document.getElementById('totalCards');
        this.adder = document.getElementById('frmAddTodo');
        this.selectorUsers = document.getElementById('todo_users');
        this.selectorTypes = document.getElementById('todo_types');
        this.selectorPrios = document.getElementById('todo_prios');
        this.modalDiv = document.getElementById('modal-id');
        this.filtersSpace = document.getElementById('filters-id');
        this.choosedFilter = null;
        this.adder.onsubmit = function(e) {
            e.preventDefault();
            var description = encodeURIComponent(this.todo_text.value.trim());
            var name = this.todo_name.value.trim();
            var type = this.todo_type.value.trim();
            var priority = this.todo_prio.value.trim();
            var deadline = encodeURIComponent(this.todo_deadline.value.trim());
            if (description == '' || name == '' || type == '') {
                return false;
            }
            UI.addTask(name, description, deadline, type, priority);
            UI.updateList();
            UI.updateUI();
            UI.poll();
            this.reset();
            return false;
        };
        this.taskType = function(name) {
            for (var i = 0; i < this.types.length; i++) {
                if (this.types[i].name == name) {
                    return this.types[i];
                }
            }
            console.log('Cannot find: \'' + name + '\'');
            return null;
        };
        this.taskPriority = function(name) {
            for (var i = 0; i < this.priorities.length; i++) {
                if (this.priorities[i].name == name) {
                    return this.priorities[i];
                }
            }
            console.log('Cannot find: \'' + name + '\'');
            return null;
        };
        this.addTask = function(name, description, deadline, type, priority) {
            var l = this.lists[0];
            var t = new Task({
                name: name,
                description: description,
                deadline: deadline,
                type: type,
                priority: priority,
            }, l, l.size());
            l.element.appendChild(t.element);
        };
        this.addList = function(name) {
            this.lists.push(new List(p.name, data.lists.length, []));
        };
        this.trashTask = function(task) {
            task.removedTime = now();
            task.list.remove(task);
            this.bin.push(task);
        };
        this.update = function(data) {
            this.lists = [];
            this.bin = [];
            this.types = [];
            this.priorities = [];
            this.users = [];
            this.readOnly = data.readOnly;
            List.index = 0;
            for (var i = 0; i < data.users.length; i++) {
                this.users.push('' + data.users[i]);
            }
            for (var i = 0; i < data.types.length; i++) {
                this.types.push(new Type(data.types[i]));
            }
            for (var i = 0; i < data.priorities.length; i++) {
                this.priorities.push(new Type(data.priorities[i]));
            }
            for (var i = 0; i < data.lists.length; i++) {
                var p = data.lists[i];
                this.lists.push(new List(p.name, i, p.tasks));
            }
            for (var i = 0; i < data.bin.length; i++) {
                this.bin.push(new Task(data.bin[i], null, List.index));
                List.index++;
            }
            this.network = false;
        };
        this.updateList = function() {
            for (var i = 0; i < this.lists.length; i++) {
                this.lists[i].update();
            }
        };
        this.updateUI = function() {
            this.board.innerHTML = '';
            var n = 0;
            for (var i = 0; i < this.lists.length; i++) {
                n += this.lists[i].size();
                this.lists[i].updateUI();
                this.board.appendChild(this.lists[i].element);
            }
            this.selectorUsers.innerHTML = '';
            for (var i = 0; i < this.users.length; i++) {
                var option = document.createElement('option');
                option.selected = (i == 0);
                option.innerHTML = this.users[i];
                option.value = this.users[i];
                this.selectorUsers.appendChild(option);
            }
            this.selectorTypes.innerHTML = '';
            for (var i = 0; i < this.types.length; i++) {
                var option = document.createElement('option');
                option.style.color = this.types[i].color;
                option.innerHTML = this.types[i].name;
                option.selected = (i == 0);
                option.value = this.types[i].name;
                this.selectorTypes.appendChild(option);
            }
            this.selectorPrios.innerHTML = '';
            for (var i = 0; i < this.priorities.length; i++) {
                var option = document.createElement('option');
                option.style.color = this.priorities[i].color;
                option.innerHTML = this.priorities[i].name;
                option.selected = (i == 0);
                option.value = this.priorities[i].name;
                this.selectorPrios.appendChild(option);
            }
            this.adder.style.display = (!this.readOnly ? "block" : "none");
            this.filtersSpace.innerHTML = '';
            var span = document.createElement('span');
            span.innerHTML = 'Filters: ';
            span.style.float = 'left';
            span.style.fontSize = '18px';
            this.filtersSpace.appendChild(span);
            var div = document.createElement('div');
            div.className = this.choosedFilter == null ? 'filter-name-selected' : 'filter-name-deselected';
            div.onclick = function() {
                UI.filter(null, this);
            };
            div.innerHTML = 'Show All';
            this.filtersSpace.appendChild(div);
            for (var i = 0; i < this.users.length; i++) {
                var div = document.createElement('div');
                div.onclick = function() {
                    UI.filter(this.innerHTML, this);
                };
                div.innerHTML = this.users[i];
                div.className = this.choosedFilter == this.users[i] ? 'filter-name-selected' : 'filter-name-deselected';
                this.filtersSpace.appendChild(div);
            }
            this.filter(this.choosedFilter);
            this.counter.innerHTML = 'Total Tasks: ' + n;
        };
        this.poll = function() {
            server_req(JSON.stringify(this.json()));
        };
        this.json = function() {
            var d = {
                lists: new Array(this.lists.length),
                bin: new Array(this.bin.length),
                types: new Array(this.types.length),
                priorities: new Array(this.priorities.length),
                users: new Array(this.users.length)
            };
            for (var i = 0; i < this.lists.length; i++) {
                d.lists[i] = this.lists[i].json();
            }
            for (var i = 0; i < this.bin.length; i++) {
                d.bin[i] = this.bin[i].json();
            }
            for (var i = 0; i < this.types.length; i++) {
                d.types[i] = this.types[i].json();
            }
            for (var i = 0; i < this.priorities.length; i++) {
                d.priorities[i] = this.priorities[i].json();
            }
            for (var i = 0; i < this.users.length; i++) {
                d.users[i] = '' + this.users[i];
            }
            return d;
        };
        this.wait = function(b) {
            this.network = b ? true : false;
        };
        this.modalShow = function(task) {
            if (task && !this.network) {
                this.modalDiv.style.display = 'block';
                this.modalDiv.task = task;
                this.modalReload();
            }
        };
        this.modalReload = function() {
            var task = this.modalDiv.task;
            document.getElementById('modal-user-id').innerHTML = task.name;
            document.getElementById('modal-type-id').innerHTML = task.type.name;
            document.getElementById('modal-prio-id').innerHTML = task.priority.name;
            document.getElementById('modal-deadline-id').innerHTML = task.deadline ? decodeURIComponent(task.deadline) : '---';
            document.getElementById('modal-type-id').style.color = task.type.color;
            document.getElementById('modal-prio-id').style.color = task.priority.color;
            document.getElementById('modal-body-id').value = decodeURIComponent(task.description);
            if (!this.readOnly) {
                document.getElementById('modal-comment-button-id').disabled = false;
                document.getElementById('modal-comment-area-id').disabled = false;
                document.getElementById('modal-body-id').disabled = false;
                document.getElementById('modal-deadline-id').ondblclick = function() {
                    ModalDialog.Input("Edit Task Deadline", "Please enter the new deadline", decodeURIComponent(UI.modalDiv.task.deadline), function(newdeadline) {
                        UI.modalEditDeadline(newdeadline.trim());
                    });
                };
                document.getElementById('modal-user-id').ondblclick = function() {
                    ModalDialog.Option("Edit Task User", "Please choose a new User to assign the Task", UI.users, null, function(newuser) {
                        UI.modalEditName(newuser);
                    });
                };
                document.getElementById('modal-type-id').ondblclick = function() {
                    ModalDialog.Option("Edit Task Type", "Please choose a new type to assign the Task", UI.types, function(v) {
                        return v.name;
                    }, function(newtype) {
                        UI.modalEditType(newtype);
                    });
                };
                document.getElementById('modal-prio-id').ondblclick = function() {
                    ModalDialog.Option("Edit Task Priority", "Please choose a new priority to assign the Task", UI.priorities, function(v) {
                        return v.name;
                    }, function(newprio) {
                        UI.modalEditPriority(newprio);
                    });
                };
            } else {
                document.getElementById('modal-comment-button-id').disabled = true;
                document.getElementById('modal-comment-area-id').disabled = true;
                document.getElementById('modal-body-id').disabled = true;
                document.getElementById('modal-deadline-id').ondblclick = null;
                document.getElementById('modal-user-id').ondblclick = null;
                document.getElementById('modal-type-id').ondblclick = null;
                document.getElementById('modal-prio-id').ondblclick = null;
            }
            var modcom = document.getElementById('modal-comments-id');
            modcom.innerHTML = '';
            for (var i = task.comments.length - 1; i >= 0; i--) {
                var div = document.createElement('div');
                var span = document.createElement('span');
                span.commentid = i;
                span.innerHTML = '&times;&nbsp;&nbsp;&nbsp;';
                span.className = 'modal-comment-cross';
                span.onclick = function() {
                    UI.modalRemoveComment(this.commentid);
                }
                div.appendChild(span);
                span = document.createElement('span');
                span.innerHTML = timeISO(task.comments[i].time).replace(/[T]|\.[0-9]+Z/g, ' ') + '&nbsp;';
                span.style.color = '#7f7f7f';
                div.appendChild(span);
                div.appendChild(document.createElement('br'));
                var span = document.createElement('span');
                span.innerHTML = decodeURIComponent(task.comments[i].comment).replace(/\n/g, '<br>');
                div.appendChild(span);
                modcom.appendChild(div);
                modcom.appendChild(document.createElement('br'));
            }
        };
        this.modalEditDeadline = function(x) {
            this.modalUpdateDescription();
            if (!this.readOnly && !this.network) {
                this.modalDiv.task.deadline = encodeURIComponent(x);
                this.modalReload();
            }
        };
        this.modalEditName = function(x) {
            this.modalUpdateDescription();
            if (!this.readOnly && !this.network) {
                this.modalDiv.task.name = x;
                this.modalReload();
            }
        };
        this.modalEditType = function(x) {
            this.modalUpdateDescription();
            if (!this.readOnly && !this.network) {
                this.modalDiv.task.type = UI.taskType(x);
                this.modalReload();
            }
        };
        this.modalEditPriority = function(x) {
            this.modalUpdateDescription();
            if (!this.readOnly && !this.network) {
                this.modalDiv.task.priority = UI.taskPriority(x);
                this.modalReload();
            }
        };
        this.modalAddComment = function(x) {
            this.modalUpdateDescription();
            if (!this.readOnly && !this.network) {
                this.modalDiv.task.addComment(encodeURIComponent(x));
                this.modalReload();
            }
        };
        this.modalRemoveComment = function(x) {
            this.modalUpdateDescription();
            if (!this.readOnly && !this.network) {
                this.modalDiv.task.removeComment(x);
                this.modalReload();
            }
        };
        this.modalUpdateDescription = function() {
            if (!this.readOnly && !this.network) {
                var desc = decodeURIComponent(this.modalDiv.task.description);
                var text = document.getElementById('modal-body-id').value.trim();
                if (text != desc && confirm('Do you want to keep the new task description?')) {
                    this.modalDiv.task.description = encodeURIComponent(text);
                }
            }
        };
        this.modalHide = function() {
            this.modalUpdateDescription();
            this.modalDiv.style.display = 'none';
            document.getElementById('modal-comments-id').innerHTML = '';
            this.modalDiv.task = null;
            if (!this.readOnly) {
                this.poll();
            }
        };
        this.filter = function(name, element) {
            if (name == '') {
                name = null;
            }
            this.choosedFilter = name;
            if (element) {
                var children = this.filtersSpace.children;
                for (var i = 0; i < children.length; i++) {
                    if (children[i].nodeName.toLowerCase() == 'div') {
                        if (children[i] != element) {
                            children[i].className = 'filter-name-deselected';
                        }
                    }
                }
                element.className = 'filter-name-selected';
            }
            for (var i = 0; i < this.lists.length; i++) {
                this.lists[i].filter(name);
            }
        };
    };

    var UI = new Kanban();

    window.addEventListener("dragover", function(e) {
        e = e || event;
        e.preventDefault();
    }, false);

    window.addEventListener("drop", function(e) {
        e = e || event;
        e.preventDefault();
    }, false);

    live('dragstart', '.list .card', function(e) {
        UI.dragging = true;
        UI.placeholder.height(e.target.offsetHeight + 'px');
        e.dataTransfer.setData('text', e.target.id);
        e.dataTransfer.dropEffect = "copy";
        e.target.classList.add('dragging');
    });

    live('dragend', '.list .card', function(e) {
        this.classList.remove('dragging');
        UI.placeholder.remove();
        UI.placeholder.height();
        UI.dragging = false;
    });

    live('dragover', '.list, .list .card, .list .card-placeholder', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (this.className === "list") {
            UI.placeholder.before = null;
            this.appendChild(UI.placeholder.element);
        } else if (this.className.indexOf('card-placeholder') !== -1) {
            UI.placeholder.before = this.parentNode.children[this.atIndex() + 1];
            this.parentNode.insertBefore(UI.placeholder.element, this);
        } else if (this.className.indexOf('card') !== -1) {
            this.parentNode.insertBefore(UI.placeholder.element, this);
        }
    });

    live('drop', '.list, .list .card-placeholder', function(e) {
        e.preventDefault();
        if (!UI.dragging || UI.network || UI.readOnly) return false;
        var task_id = e.dataTransfer.getData('text');
        var task = document.getElementById(task_id);
        if (this.className === 'list') {
            this.appendChild(task);
        } else {
            this.parentNode.replaceChild(task, this);
        }
        UI.updateList();
        UI.updateUI();
        UI.poll();
    });

    live('drop', '.bin', function(e) {
        e.preventDefault();
        if ( /*!UI.dragging ||*/ UI.network || UI.readOnly) return false;
        var task_id = e.dataTransfer.getData('text');
        var task = document.getElementById(task_id);
        UI.trashTask(task.self);
        UI.updateUI();
        UI.poll();
    });

    function server_req(body, disableWrite) {
        var xhr = new AJAX(body ? "POST" : "GET", "kanban", function(data) {
            UI.update(JSON.parse(data));
            UI.updateUI();
        }, body);
        UI.wait(true);
    }

    document.getElementById('modal-cross-id').onclick = function() {
        UI.modalHide();
    };

    document.getElementById('modal-comment-button-id').onclick = function() {
        var area = document.getElementById('modal-comment-area-id');
        if (area.value.trim() != '') {
            UI.modalAddComment(area.value.trim());
            area.value = '';
        }
    };

    window.onclick = function(event) {
        if (event.target == UI.modalDiv) {
            UI.modalHide();
        }
    };

    document.addEventListener("DOMContentLoaded", function() {
        server_req(null, true);
    });
})();
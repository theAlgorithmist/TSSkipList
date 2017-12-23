/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
/**
 * Typescript Math Toolkit: Skip list.  This version uses a simple probability model (coin flip) to decide
 * whether or not to level-up.  A more general facility is likely in the future.  This implementation of a skip list
 * also has additional methods that make it useful for applications other than as a substitute for a binary tree.  It
 * supports O(1) retrieval of minimum and maximum list (numerical) values as well as fast removal of the minimum- or
 * maximum-value node.  With these methods, the list could be used as an alternative to a min or max binary heap.
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */
var SkipListNodeImpl_1 = require('./SkipListNodeImpl');
var TSMT$SkipList = (function () {
    /**
     * Construct a new TSMT$SkipList
     *
     * @return {nothing}
     */
    function TSMT$SkipList() {
        // default min and max-values of an empty list
        this._min = -Number.MAX_VALUE;
        this._max = Number.MAX_VALUE;
        this._p = 2; // default probability model is coin flip
        this.clear();
    }
    Object.defineProperty(TSMT$SkipList.prototype, "size", {
        /**
         * Access the size or number of nodes in the list
         *
         * @return {number} Total number of nodes
         */
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$SkipList.prototype, "min", {
        get: function () {
            return this._size > 0 ? this._columnTail.next.value : this._min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$SkipList.prototype, "max", {
        get: function () {
            return this._size > 0 ? this._listTail.value : this._max;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$SkipList.prototype, "levels", {
        get: function () {
            if (this._size <= 1) {
                return 1;
            }
            var levels = 1;
            var node = this._columnHead;
            while (node.down != null) {
                levels++;
                node = node.down;
            }
            return levels;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$SkipList.prototype, "list", {
        get: function () {
            var result = new Array();
            if (this._size > 0) {
                var head = this._columnHead;
                while (head) {
                    var row = new Array();
                    var node = head;
                    var obj = void 0;
                    while (node != null) {
                        obj = node.toData();
                        obj.up = node.up ? node.up.key : 'null';
                        obj.dn = node.down ? node.down.key : 'null';
                        row.push(obj);
                        node = node.next;
                    }
                    result.push(row);
                    head = head.down;
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSMT$SkipList.prototype, "p", {
        set: function (value) {
            this._p = !isNaN(value) && value > 0 ? Math.floor(value) : this._p;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clear the current list
     *
     * @return {nothing} The list is cleared and ready for new entries.  The probability model remains unchanged.
     */
    TSMT$SkipList.prototype.clear = function () {
        this._topLevel = -1;
        this._columnHead = this.__newLevel(null);
        this._node = null;
        this._head = null;
        this._size = 0;
    };
    TSMT$SkipList.prototype.toArray = function (reverse) {
        if (reverse === void 0) { reverse = false; }
        var result = new Array();
        if (this._size > 0) {
            if (reverse) {
                var node = this._listTail;
                while (node.prev != null) {
                    if (node.value != Number.MAX_VALUE) {
                        result.push(node.toData());
                    }
                    node = node.prev;
                }
            }
            else {
                var node = this._columnTail;
                while (node.next != null) {
                    if (node.value != -Number.MAX_VALUE) {
                        result.push(node.toData());
                    }
                    node = node.next;
                }
            }
        }
        return result;
    };
    TSMT$SkipList.prototype.fromArray = function (values) {
        if (values && values.length > 0) {
            var n = values.length;
            var i = void 0;
            for (i = 0; i < n; ++i) {
                this.insert(i.toString(), values[i]);
            }
        }
    };
    TSMT$SkipList.prototype.insert = function (id, value, aux) {
        if (value != null && value !== undefined && id !== undefined && id != '') {
            // insert into the bottom row (full list)
            var insert = this.__insertionNode(this._columnTail, value);
            if (insert == null) {
                // value is not comparable or already exists in the list
                return;
            }
            else {
                // insert into the bottom or 'list' row in between existing nodes
                this.__insertInto(insert, id, value, aux);
                // level up?
                var curHead = this._columnTail;
                var prev = insert.prev;
                var node = void 0;
                while (this._size > 2 && this.__levelUp()) {
                    if (curHead.up != null) {
                        // insert into an already existing row
                        insert = this.__insertionNode(curHead.up, value);
                        node = this.__insertInto(insert, id, value, aux);
                        curHead = curHead.up;
                    }
                    else {
                        // create a new row - the insertion node is always the tail of the new row (i.e. inf node)
                        curHead = this.__newLevel(curHead);
                        node = this.__insertInto(curHead.next, id, value, aux);
                    }
                    // set up/down linkage
                    prev.up = node;
                    node.down = prev;
                    // for next level-up
                    prev = node;
                }
            }
            this._size++;
        }
        return;
    };
    TSMT$SkipList.prototype.delete = function (value) {
        var deletedData = null;
        if (value !== undefined && value != null) {
            // find the node with the specified value in the bottom row; this is inefficient as it does not use the class
            // find() method, however, deletes are rare and any use of the find() method would also disturb caching and
            // other optimizations in place for frequent finds.
            var node = this._columnTail.next;
            var found = false;
            while (node != null) {
                if (node.value == value) {
                    found = true;
                    deletedData = node.toData();
                    break;
                }
                node = node.next;
            }
            if (found) {
                // delete all references to this node upward in the list
                this.__deleteFrom(node);
                // if the deleted node is the tail of the bottom row, we have to adjust that link
                if (value == this._listTail.value) {
                    this._listTail = this._listTail.prev;
                }
                // did we delete the value corresponding to the currently cached node?
                if (this._node !== null && value == this._node.value) {
                    this._node = null;
                }
                this._size--;
            }
        }
        return deletedData;
    };
    TSMT$SkipList.prototype.removeMin = function () {
        // nothing to remove if there is no list
        if (this._size == 0) {
            return null;
        }
        var toDelete = this._columnTail.next;
        this.__deleteFrom(this._columnTail.next);
        this._size--;
        return toDelete.toData();
    };
    TSMT$SkipList.prototype.removeMax = function () {
        // nothing to remove if there is no list
        if (this._size == 0) {
            return null;
        }
        var toDelete = this._listTail;
        this.__deleteFrom(this._listTail);
        // this is a bit subtle - have to clean up this link
        this._listTail = this._listTail.prev;
        this._size--;
        return toDelete.toData();
    };
    TSMT$SkipList.prototype.find = function (value) {
        // repeat cached query?
        var startNode = this._columnHead;
        if (this._node !== null) {
            if (this._node.value == value) {
                return this._node.toData();
            }
            if (value > this._node.value) {
                // use the current node as the starting location in the list
                startNode = this._node;
            }
        }
        // edge cases
        if (this._size == 0) {
            return null;
        }
        if (this._size == 1) {
            this._node = this._columnTail.next.clone();
            return this._node.toData();
        }
        // the starting node serves as a head node for the start search level
        var curHead = startNode;
        while (curHead) {
            var node = curHead;
            while (node) {
                if (node.value == value) {
                    this._node = node;
                    return this._node.toData();
                }
                else if (node.value > value) {
                    // time to drop down a level
                    node = node.prev; // we went one too far ...
                    break;
                }
                node = node.next;
            }
            curHead = node.down;
        }
        return null;
    };
    TSMT$SkipList.prototype.__newLevel = function (head) {
        this._topLevel++;
        if (head == null) {
            // empty list, bottom level - begin the level with a -infinity node
            head = new SkipListNodeImpl_1.TSMT$SkipListNode();
            head.prev = null;
            head.up = null;
            head.key = '-inf';
            head.level = this._topLevel;
            head.value = -Number.MAX_VALUE;
            // head and tail match for empty or one-level list
            this._columnHead = head;
            this._columnTail = this._columnHead;
            this._listTail = this._columnTail;
            // finish off the bottom level with an 'infinity' node so that there is always a place to make a valid insertion
            var infNode = new SkipListNodeImpl_1.TSMT$SkipListNode();
            infNode.key = 'inf';
            infNode.value = Number.MAX_VALUE;
            infNode.level = this._topLevel;
            this._columnTail.next = infNode;
            this._columnHead.next = infNode;
            infNode.prev = this._columnTail;
            this._columnTail.level = 0;
            this._columnHead.level = 0;
            return this._columnHead;
        }
        else {
            var newHead = new SkipListNodeImpl_1.TSMT$SkipListNode();
            newHead.prev = null;
            newHead.next = null;
            newHead.up = null;
            newHead.level = this._topLevel;
            newHead.down = this._columnHead;
            newHead.key = '-inf';
            newHead.value = -Number.MAX_VALUE;
            this._columnHead.up = newHead;
            // reset head node for columns
            this._columnHead = newHead;
            // infinity node for this level
            var infNode = new SkipListNodeImpl_1.TSMT$SkipListNode();
            infNode.key = 'inf';
            infNode.value = Number.MAX_VALUE;
            infNode.level = this._topLevel;
            newHead.next = infNode;
            infNode.prev = newHead;
            return newHead;
        }
    };
    TSMT$SkipList.prototype.__deleteFrom = function (deleteNode) {
        // console.log( "removing: ", deleteNode.key);
        // remove the node from it's current level, but if the node has an upward link, it must also be removed from all
        // upper levels
        var prev = deleteNode.prev;
        var next = deleteNode.next;
        prev.next = next;
        next.prev = prev;
        if (deleteNode.up != null) {
            deleteNode.up.down = null;
            this.__deleteFrom(deleteNode.up);
        }
    };
    TSMT$SkipList.prototype.__insertInto = function (insert, id, value, aux) {
        var prev = insert.prev;
        var curNode = new SkipListNodeImpl_1.TSMT$SkipListNode();
        curNode.key = id;
        curNode.value = value;
        curNode.level = insert.level;
        if (aux) {
            curNode.aux = JSON.parse(JSON.stringify(aux));
        }
        if (insert.key == 'inf' && insert.level == 0) {
            // the inserted node is the new tail node for the bottom row of this list - this one always contains the max-value of the list and
            // can be used to traverse the list in reverse order since all row lists are doubly-linked
            this._listTail = curNode;
        }
        curNode.prev = prev;
        curNode.next = insert;
        prev.next = curNode;
        insert.prev = curNode;
        return curNode;
    };
    TSMT$SkipList.prototype.__levelUp = function () {
        return Math.random() < 0.5;
    };
    TSMT$SkipList.prototype.__insertionNode = function (node, value) {
        while ((node && node.next != null) || node.value == Number.MAX_VALUE) {
            if (node.value == value) {
                // value already exists in the list, so there is no place to perform an insertion
                return null;
            }
            else if (node.value > value) {
                // first node whose value is greater than the input value
                return node;
            }
            node = node.next;
        }
        return null;
    };
    return TSMT$SkipList;
}());
exports.TSMT$SkipList = TSMT$SkipList;

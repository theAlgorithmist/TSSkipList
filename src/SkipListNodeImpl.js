/**
 * Copyright 2017 Jim Armstrong (www.algorithmist.net)
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
var TSMT$SkipListNode = (function () {
    function TSMT$SkipListNode() {
        this.key = '';
        this.aux = {};
        this.value = null;
        this.level = 0;
        this.prev = null;
        this.next = null;
        this.up = null;
        this.down = null;
    }
    TSMT$SkipListNode.prototype.clone = function () {
        var node = new TSMT$SkipListNode();
        node.key = this.key;
        node.value = this.value;
        node.aux = JSON.parse(JSON.stringify(this.aux));
        node.prev = this.prev;
        node.next = this.next;
        node.up = this.up;
        node.down = this.down;
        return node;
    };
    TSMT$SkipListNode.prototype.toData = function () {
        return {
            key: this.key,
            value: this.value,
            aux: this.aux
        };
    };
    return TSMT$SkipListNode;
}());
exports.TSMT$SkipListNode = TSMT$SkipListNode;

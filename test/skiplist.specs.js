/** Copyright 2017 Jim Armstrong (www.algorithmist.net)
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
var SkipList_1 = require("../src/SkipList");
var Chai = require('chai');
var expect = Chai.expect;
// Test Suites
describe('Skip List Tests: TSMT$SkipList', function () {
    var __list = function (result) {
        var n = result.length;
        var i;
        var row;
        for (i = 0; i < n; ++i) {
            console.log("");
            console.log("   Level: ", i);
            row = result[i];
            console.log(row);
        }
    };
    // Usage (to view the structure of small lists)
    // const result: Array<Array<TSMT$ISkipListData>> = list.list;
    // __list(result);
    it('properly constructs a new skip list', function () {
        var list = new SkipList_1.TSMT$SkipList();
        expect(list.size).to.equal(0);
        expect(list.toArray().length).to.equal(0);
        expect(list.min).to.equal(-Number.MAX_VALUE);
        expect(list.max).to.equal(Number.MAX_VALUE);
    });
    it('find from an empty list returns null', function () {
        var list = new SkipList_1.TSMT$SkipList();
        expect(list.find(1)).to.be.null;
    });
    it('Insert a singleton results in list size of one', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        expect(list.size).to.equal(1);
    });
    it('find works with a singleton', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        var result = list.find(0);
        expect(result.value).to.equal(0);
    });
    it('toArray works with a singleton', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        var result = list.toArray();
        expect(result.length).to.equal(1);
        expect(result[0].key).to.equal('0');
        expect(list.levels).to.equal(1); // about the only time we expect this to be deterministic
    });
    it('does not insert duplicates multiple times', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 0);
        expect(list.size).to.equal(1);
        expect(list.toArray()[0].key).to.equal('0');
    });
    it('inserts two nodes correctly #1', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        var elements = list.toArray();
        expect(list.size).to.equal(2);
        expect(elements[0].key).to.equal('0');
        expect(elements[1].key).to.equal('1');
    });
    it('inserts two nodes correctly #2', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('1', 1);
        list.insert('0', 0);
        var elements = list.toArray();
        expect(list.size).to.equal(2);
        expect(elements[0].key).to.equal('0');
        expect(elements[1].key).to.equal('1');
    });
    it('inserts three nodes correctly #1', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        list.insert('2', 2);
        var elements = list.toArray();
        expect(list.size).to.equal(3);
        expect(elements[0].key).to.equal('0');
        expect(elements[1].key).to.equal('1');
        expect(elements[2].key).to.equal('2');
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(2);
    });
    it('inserts three nodes correctly #2', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('1', 1);
        list.insert('0', 0);
        list.insert('2', 2);
        var elements = list.toArray();
        expect(list.size).to.equal(3);
        expect(elements[0].key).to.equal('0');
        expect(elements[1].key).to.equal('1');
        expect(elements[2].key).to.equal('2');
    });
    it('inserts three nodes correctly #3', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('2', 2);
        list.insert('1', 1);
        list.insert('0', 0);
        var elements = list.toArray();
        expect(list.size).to.equal(3);
        expect(elements[0].key).to.equal('0');
        expect(elements[1].key).to.equal('1');
        expect(elements[2].key).to.equal('2');
    });
    it('inserts four nodes correctly #1', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('2', 2);
        list.insert('1', 1);
        list.insert('0', 0);
        list.insert('3', 3);
        var elements = list.toArray();
        expect(list.size).to.equal(4);
        expect(elements[0].key).to.equal('0');
        expect(elements[1].key).to.equal('1');
        expect(elements[2].key).to.equal('2');
        expect(elements[3].key).to.equal('3');
    });
    it('inserts four nodes correctly #2', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('2', 2);
        list.insert('1', 1);
        list.insert('3', 3);
        list.insert('0', 0);
        var elements = list.toArray();
        expect(list.size).to.equal(4);
        expect(elements[0].key).to.equal('0');
        expect(elements[1].key).to.equal('1');
        expect(elements[2].key).to.equal('2');
        expect(elements[3].key).to.equal('3');
    });
    it('inserts five nodes correctly', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('2', 2);
        list.insert('1', 1);
        list.insert('4', 4);
        list.insert('0', 0);
        list.insert('3', 3);
        var elements = list.toArray();
        expect(list.size).to.equal(5);
        expect(elements[0].key).to.equal('0');
        expect(elements[1].key).to.equal('1');
        expect(elements[2].key).to.equal('2');
        expect(elements[3].key).to.equal('3');
        expect(elements[4].key).to.equal('4');
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(4);
        // const result: Array<Array<TSMT$ISkipListData>> = list.list;
        // __list(result);
    });
    it('toArray works in reverse', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('2', 2);
        list.insert('1', 1);
        list.insert('4', 4);
        list.insert('0', 0);
        list.insert('3', 3);
        var elements = list.toArray(true);
        expect(list.size).to.equal(5);
        expect(elements.length).to.equal(5);
        expect(elements[0].key).to.equal('4');
        expect(elements[1].key).to.equal('3');
        expect(elements[2].key).to.equal('2');
        expect(elements[3].key).to.equal('1');
        expect(elements[4].key).to.equal('0');
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(4);
    });
    it('removeMin returns null for empty list', function () {
        var list = new SkipList_1.TSMT$SkipList();
        expect(list.size).to.equal(0);
        var removed = list.removeMin();
        expect(removed).to.be.null;
    });
    it('removeMin multinode test', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('2', 2);
        list.insert('1', 1);
        list.insert('4', 4);
        list.insert('0', 0);
        list.insert('3', 3);
        expect(list.size).to.equal(5);
        // let result: Array<Array<TSMT$ISkipListData>> = list.list;
        // __list(result);
        var removed = list.removeMin();
        expect(list.size).to.equal(4);
        expect(list.min).to.equal(1);
        expect(list.max).to.equal(4);
    });
    it('removeMax returns null for empty list', function () {
        var list = new SkipList_1.TSMT$SkipList();
        expect(list.size).to.equal(0);
        var removed = list.removeMax();
        expect(removed).to.be.null;
    });
    it('removeMax multinode test', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('2', 2);
        list.insert('1', 1);
        list.insert('4', 4);
        list.insert('0', 0);
        list.insert('3', 3);
        expect(list.size).to.equal(5);
        // let result: Array<Array<TSMT$ISkipListData>> = list.list;
        // __list(result);
        var removed = list.removeMax();
        expect(list.size).to.equal(4);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(3);
    });
    it('fromArray creates null list for no input', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.fromArray([]);
        expect(list.size).to.equal(0);
    });
    it('fromArray works with multiple values', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.fromArray([2, 1, 3, 0]);
        expect(list.size).to.equal(4);
        var elements = list.toArray();
        expect(elements[0].value).to.equal(0);
        expect(elements[1].value).to.equal(1);
        expect(elements[2].value).to.equal(2);
        expect(elements[3].value).to.equal(3);
    });
    it('find from an empty list returns null', function () {
        var list = new SkipList_1.TSMT$SkipList();
        var result = list.find(1);
        expect(result).to.be.null;
    });
    it('find from an singleton list returns correct value', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        var result = list.find(0);
        expect(result.value).to.equal(0);
    });
    it('find returns cached value on two calls with same value', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        var result = list.find(0);
        expect(result.value).to.equal(0);
        result = list.find(0);
        expect(result.value).to.equal(0);
    });
    it('find returns aux data correctly', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0, { key: 'zero', value: 0 });
        var result = list.find(0);
        var data = result.aux;
        expect(result.value).to.equal(0);
        expect(data['key']).to.equal('zero');
        expect(data['value']).to.equal(0);
    });
    it('find works on a 2-node list #1', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        var result = list.find(0);
        expect(result.key).to.equal('0');
        expect(result.value).to.equal(0);
    });
    it('find works on a 2-node list #2', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        var result = list.find(1);
        expect(result.key).to.equal('1');
        expect(result.value).to.equal(1);
    });
    it('find works on a 3-node list', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        list.insert('2', 2);
        var result = list.find(0);
        expect(result.key).to.equal('0');
        expect(result.value).to.equal(0);
        result = list.find(2);
        expect(result.key).to.equal('2');
        expect(result.value).to.equal(2);
    });
    it('find works on a 4-node list #1', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        list.insert('2', 2);
        list.insert('3', 3);
        var result = list.find(3);
        expect(result.key).to.equal('3');
        expect(result.value).to.equal(3);
    });
    it('find works on a 4-node list #2', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        list.insert('2', 2);
        list.insert('3', 3);
        var result = list.find(2);
        expect(result.key).to.equal('2');
        expect(result.value).to.equal(2);
        result = list.find(3);
        expect(result.key).to.equal('3');
        expect(result.value).to.equal(3);
        result = list.find(0);
        expect(result.key).to.equal('0');
        expect(result.value).to.equal(0);
    });
    it('multi-node find', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        list.insert('2', 2);
        list.insert('3', 3);
        list.insert('7', 7);
        list.insert('21', 21);
        list.insert('16', 16);
        list.insert('11', 11);
        expect(list.size).to.equal(8);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(21);
        // const result: Array<Array<TSMT$ISkipListData>> = list.list;
        // __list(result);
        var node = list.find(2);
        expect(node.key).to.equal('2');
        expect(node.value).to.equal(2);
        node = list.find(3);
        expect(node.key).to.equal('3');
        expect(node.value).to.equal(3);
        node = list.find(4);
        expect(node).to.be.null;
        node = list.find(7);
        expect(node.key).to.equal('7');
        expect(node.value).to.equal(7);
        node = list.find(11);
        expect(node.key).to.equal('11');
        expect(node.value).to.equal(11);
        node = list.find(16);
        expect(node.key).to.equal('16');
        expect(node.value).to.equal(16);
        node = list.find(21);
        expect(node.key).to.equal('21');
        expect(node.value).to.equal(21);
    });
    // it('delete on an empty list returns null', () =>
    // {
    //   const list: TSMT$SkipList = new TSMT$SkipList();
    //
    //   let result: TSMT$ISkipListData = list.delete(2);
    //
    //   expect(list.size).to.equal(0);
    //   expect(result).to.be.null;
    // });
    //
    // it('delete on invalid value returns null', () =>
    // {
    //   const list: TSMT$SkipList = new TSMT$SkipList();
    //
    //   list.insert('0', 0);
    //   list.insert('1', 1);
    //
    //   let result: TSMT$ISkipListData = list.delete(2);
    //
    //   expect(list.size).to.equal(2);
    //   expect(result).to.be.null;
    // });
    it('delete 2-node test #1', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        var result = list.delete(0);
        expect(list.size).to.equal(1);
        expect(result.value).to.equal(0);
        expect(list.min).to.equal(1);
        expect(list.max).to.equal(1);
    });
    it('delete 2-node test #2', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('1', 1);
        var result = list.delete(1);
        expect(list.size).to.equal(1);
        expect(result.value).to.equal(1);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(0);
    });
    it('delete multi-node test', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('5', 5);
        list.insert('15', 15);
        list.insert('1', 1);
        list.insert('11', 11);
        list.insert('21', 21);
        list.insert('2', 2);
        expect(list.size).to.equal(7);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(21);
        var result = list.delete(11);
        expect(result.value).to.equal(11);
        expect(list.size).to.equal(6);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(21);
        result = list.delete(21);
        expect(result.value).to.equal(21);
        expect(list.size).to.equal(5);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(15);
        result = list.delete(0);
        expect(result.value).to.equal(0);
        expect(list.size).to.equal(4);
        expect(list.min).to.equal(1);
        expect(list.max).to.equal(15);
        result = list.delete(30);
        expect(result).to.be.null;
    });
    it('delete-find test', function () {
        var list = new SkipList_1.TSMT$SkipList();
        list.insert('0', 0);
        list.insert('5', 5);
        list.insert('16', 16);
        list.insert('15', 15);
        list.insert('11', 11);
        list.insert('21', 21);
        list.insert('2', 2);
        list.insert('3', 3);
        expect(list.size).to.equal(8);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(21);
        var result = list.delete(11);
        expect(result.value).to.equal(11);
        expect(list.size).to.equal(7);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(21);
        result = list.find(21);
        expect(result.key).to.equal('21');
        result = list.delete(21);
        expect(result.value).to.equal(21);
        expect(list.size).to.equal(6);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(16);
        result = list.find(21);
        expect(result).to.be.null;
        result = list.delete(3);
        expect(list.size).to.equal(5);
        expect(list.min).to.equal(0);
        expect(list.max).to.equal(16);
        result = list.delete(16);
        result = list.delete(0);
        expect(list.size).to.equal(3);
        expect(list.min).to.equal(2);
        expect(list.max).to.equal(15);
    });
});

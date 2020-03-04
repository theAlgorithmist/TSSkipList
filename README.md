# Typescript Math Toolkit Skip List

I have a particular fascination with skip lists as they are a stochastic, not deterministic data structure. For example. if a balanced tree is initialized with the exact same data in the exact same sequence, the tree produces the exact same structure.  Repeat the same procedure with a skip list and the structure may be different.  While the structure follows a similar pattern in both cases, a probability model determines the exact nature of each level in the 'grid.'

With a model of _p = 1/2_, a skip list has comparable insert/find complexity to a balanced binary tree.  It is a fundamentally simpler structure and with some effort, it can be modified to support operations such as O(1) query of minimum- and maximum-value. The addition of _removeMin()_ and _removeMax()_ methods allow the structure to substitute for a min- or max-heap.

If you are not already familiar with the concepts behind a skip list, [I personally recommend this paper] by Pugh.

This repo contains the first implementation of a skip list in the Typescript Math Toolkit.


Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 2.0.3

Version: 1.0


## Installation

Installation involves all the usual suspects

  - npm and gulp installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. gulp compile

2. gulp test

The test suite is in Mocha/Chai and specs reside in the _test_ folder.



### Introduction

The _Typescript Math Toolkit_ skip list is an ordered (by increasing value) list of numerical data that is associated with a string key and optional _Object_ data.

Internally, the skip list is represented as a sparse grid where each row is a doubly-linked list (with -infinity and +infinity nodes at each end).  The bottom row of the list contains the list nodes in increasing order.  Pointers are maintained that provide quick access to the head of the first row as well as head/tail of the last row.  This makes O(1) access of minimum and maximum value possible.  It is also possible to mimic a min or max binary heap by using the _removeMin()_ and _removeMax()_ methods.

Insertion and find are O(log(n)) operations while delete is O(n).  Currently, find is optimized to use the result of prior find operations and will be further optimized for more efficient starting location in the future.  Using the class _find_ method inside _delete_ overwrites find-related optimizations.  As delete is a very infrequent operation, it is currently unoptimized.


### Contents

This first release of the _Typescript Math Toolkit_ skip list does not contain all the functionality I would like, but I believe it has functionality beyond other more mature implementations of the same structure in other languages.

The fundamental inteface for dealing with return data from the _TSMT$SkipList_ class is


```
export interface TSMT$ISkipListData
{
  key: string;                // general key or id for this node
  value: number;              // node value (in future will likely be an IComparable)
  aux: Object;                // some auxiliary data that is store with the node

  up?: string;                // optional information about up-linkage
  dn?: string;                // optional information about down-linkage
}
```

The primary information of interest to the user is the _key_, _value_, and _aux_ properties.  Other properties are useful only when displaying information about the internal list structure.


The public API of the _TSMT$SkipList_ class is

```
public get size(): number
public get min(): number
public get max(): number
public get levels(): number
public get list(): Array< Array<TSMT$ISkipListData> >
public set p(value: number)
public clear(): void
public toArray(reverse: boolean = false): Array<TSMT$ISkipListData>
public fromArray(values: Array<number>): void
public insert(id: string, value: number, aux?: Object): void
public delete(value: number): TSMT$ISkipListData
public removeMin(): TSMT$ISkipListData
public removeMax(): TSMT$ISkipListData
public find(value: number): TSMT$ISkipListData
```

### Usage

A skip list is an ordered list of numerical values, each of which should be unique as duplicates are ignored during insertion.  Each value is associated with a string key that should be (but is not absolutely required) to be unique.  An auxiliary data _Object_ may also be associated with the numerical value.

Nodes may be inserted on at a time or if no auxiliary data Object is associated with nodes (and id's are not important), the list may be initialized from an a array of numbers.

```
const list: TSMT$SkipList = new TSMT$SkipList();

list.insert('0', 0);
list.insert('1', 1);
.
.
.

or

list.insert('0', 0, {key: 'key0', lower: 0, upper: 10});
list.insert('1', 1, {key: 'key1', lower: -1, upper: 5});
.
.
.

or

const list: TSMT$SkipList = new TSMT$SkipList();

list.fromArray( [2, 1, 3, 0] );

```

In the latter case, keys are automatically assigned in (zero-index) order of insertion, so the value 2 is associated with the key '0'.  The value 1 is associated with the key '1' and so forth.

The list is internally maintained in sorted (increasing) order.  Several queries are available such as size of the list, number of levels, minimum value, maximum value (both O(1) queries), as well as a representation of the list itself.  The latter should only be queried for small lists.

The list may be returned as an array, either in natural (increasing) order or reversed (decreasing) order.  Both queries have the same operation count.

For example,


```
const list: TSMT$SkipList = new TSMT$SkipList();

list.insert('2', 2);
list.insert('1', 1);
list.insert('4', 4);
list.insert('0', 0);
list.insert('3', 3);

const size: number = list.size;  // returns 5

const elements: Array<TSMT$ISkipListData> = list.toArray();  // returns [0, 1, 2, 3, 4]

const reversed: Array<TSMT$ISkipListData> = list.toArray(true);  // returns [4, 3, 2, 1, 0]

const minimum: number = list.min; // returns 0;
const maximum: number = list.max; // returns 4;
```

Finding a node in the list corresponding to a specified value is the fundamental list operation after a sequence of insertions.  Complexity is _log(n)_ with a _p = 2_ probability model (the default).

The find operation is further optimized to cache the most recent query and start at a more optimal node in the list for successive queries of increasing value.  Further searching optimizations will be implemented in the future.

```
const list: TSMT$SkipList = new TSMT$SkipList();

list.insert('0', 0);
list.insert('1', 1);
list.insert('2', 2);

let result: TSMT$ISkipListData = list.find(0);

expect(result.key).to.equal('0');
expect(result.value).to.equal(0);

result = list.find(2);

expect(result.key).to.equal('2');
expect(result.value).to.equal(2);
```

The _aux_ property in the return is an empty _Object_ in the above example.

Nodes may be removed from the list by a specified value using the _delete()_ method.  A simple example is

```
const list: TSMT$SkipList = new TSMT$SkipList();

list.insert('0', 0);
list.insert('1', 1);

let result: TSMT$ISkipListData = list.delete(1);

expect(list.size).to.equal(1);
expect(result.value).to.equal(1);

expect(list.min).to.equal(0);
expect(list.max).to.equal(0);
```

It is also possible to remove the nodes corresponding to minimum and maximum value.  After removal, the new min/max may still be queried in O(1) time.  There is no cost to 'rebalance' the list.

```
const list: TSMT$SkipList = new TSMT$SkipList();

list.insert('2', 2);
list.insert('1', 1);
list.insert('4', 4);
list.insert('0', 0);
list.insert('3', 3);

expect(list.size).to.equal(5);

let removed: TSMT$ISkipListData = list.removeMin();

expect(list.size).to.equal(4);

expect(list.min).to.equal(1);
expect(list.max).to.equal(4);
```

Refer to the specs in the _test_ folder for more usage examples.


### Notes

A utility function, ___list_ is provided in the spec file.  Along with a class query method, it can be used to display the list structure,

```
let result: Array<Array<TSMT$ISkipListData>> = list.list;
__list(result);
```

This is recommended only for small lists.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <https://www.linkedin.com/in/jimarmstrong>

[I personally recommend this paper]: <http://cglab.ca/~morin/teaching/5408/refs/p90b.pdf>


<img src="ruit-logo.svg" width="46%"/>

Functional tasks serialization mini script (0.3kb)

[![Build Status][travis-image]][travis-url]

[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

## Installation

```js
import ruit from 'ruit'
```

[travis-image]: https://img.shields.io/travis/GianlucaGuarini/ruit.svg?style=flat-square

[travis-url]: https://travis-ci.org/GianlucaGuarini/ruit

[license-image]: http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square

[license-url]: LICENSE.txt

[npm-version-image]: http://img.shields.io/npm/v/ruit.svg?style=flat-square

[npm-downloads-image]: http://img.shields.io/npm/dm/ruit.svg?style=flat-square

[npm-url]: https://npmjs.org/package/ruit

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### ruit

Serialize a list of sync and async tasks from left to right

**Parameters**

-   `tasks` **any** list of tasks to process sequentially

**Examples**

```javascript
const curry = f => a => b => f(a, b)
const add = (a, b) => a + b

const addOne = curry(add)(1)

const squareAsync = (num) => {
  return new Promise(r => {
    setTimeout(r, 500, num * 2)
  })
}

// a -> a + a -> a * 2
// basically from left to right: 1 => 1 + 1 => 2 * 2
ruit(1, addOne, squareAsync).then(result => console.log(result)) // 4
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise containing the result of the whole chain

#### cancel

Helper that can be returned by ruit function to cancel the tasks chain

**Examples**

```javascript
ruit(
  100,
  num => Math.random() * num
  num => num > 50 ? ruit.cancel() : num
  num => num - 2
).then(result => {
  console.log(result) // here we will get only number lower than 50
})
```

Returns **[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)** internal private constant

#### compose

The same as ruit() but with the arguments inverted from right to left

**Parameters**

-   `tasks` **any** list of tasks to process sequentially

**Examples**

```javascript
const curry = f => a => b => f(a, b)
const add = (a, b) => a + b

const addOne = curry(add)(1)

const squareAsync = (num) => {
  return new Promise(r => {
    setTimeout(r, 500, num * 2)
  })
}

// a -> a + a -> a * 2
// basically from right to left: 1 => 1 + 1 => 2 * 2
ruit.compose(squareAsync, addOne, 1).then(result => console.log(result)) // 4
```

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** a promise containing the result of the whole chain

# Ruit meaning

`ruit` comes from the `ruere` latin verb that means `It falls`, It expresses properly the essence of this script and sounds also similar to `run it`

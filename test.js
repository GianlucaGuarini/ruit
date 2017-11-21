/* eslint-disable no-new */

const assert = require('assert')
const ruit = require('./')

const curry = f => a => b => f(a, b)
const add = (a, b) => a + b
const divide = (a, b) => b / a

const addOne = curry(add)(1)
const divideBy2 = curry(divide)(2)

const squareAsync = (num) => {
  return new Promise(r => {
    setTimeout(r, 500, num * 2)
  })
}

const addOneAsync = (num) => {
  return new Promise(r => {
    setTimeout(r, 500, addOne(num))
  })
}

describe('ruit()', function() {
  it('it can run a simple sync async sequence', (done) => {
    ruit(1, addOne, squareAsync)
      .then(result => {
        assert.equal(result, 4)
        done()
      })
  })

  it('it can handle also nil return values', (done) => {
    ruit(undefined, null, 0)
      .then(result => {
        assert.equal(result, 0)
        done()
      })
  })

  it('compose multiple ruit sequences', (done) => {
    const addAndSquare = ruit(1, addOneAsync, squareAsync)
    ruit(addAndSquare, divideBy2).then(result => {
      assert.equal(result, 2)
      done()
    })
  })

  it('it can catch errors in the sequence chain', (done) => {
    const addAndSquare = ruit(1, addOneAsync, squareAsync)
    ruit(
      () => {
        throw new Error('random error')
      },
      addAndSquare
    )
      .then(result => {
        throw new Error('it should never come here')
      })
      .catch(() => done())
  })


  it('it can catch rejections in the sequence chain', (done) => {
    const addAndSquare = ruit(1, addOneAsync, squareAsync)
    ruit(
      () => {
        return Promise.reject()
      },
      addAndSquare
    )
      .then(result => {
        throw new Error('it should never come here')
      })
      .catch(() => done())
  })

  it('it can cancel the sequence chain', (done) => {
    const addAndSquare = ruit(1, addOneAsync, squareAsync)
    ruit(ruit.cancel(), addAndSquare).then(result => {
      throw new Error('it should never come here')
    })

    setTimeout(() => done(), 1000)
  })
})

describe('ruit.compose()', function() {
  it('it can run a simple sync async sequence', (done) => {
    ruit.compose(squareAsync, addOne, 1)
      .then(result => {
        assert.equal(result, 4)
        done()
      })
  })

  it('compose multiple ruit sequences', (done) => {
    const addAndSquare = ruit.compose(squareAsync, addOneAsync, 1)
    ruit.compose(divideBy2, addAndSquare).then(result => {
      assert.equal(result, 2)
      done()
    })
  })

  it('it can cancel the sequence chain', (done) => {
    const addAndSquare = ruit.compose(squareAsync, addOneAsync, 1)
    ruit.compose(ruit.cancel(), addAndSquare).then(result => {
      throw new Error('it should never come here')
    })

    setTimeout(() => done(), 1000)
  })
})
/* eslint-disable no-new */

const assert = require('assert')
const ruit = require('./')

const addOne = num => num + 1
const divideBy2 = num => num / 2

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

describe('ruit', function() {
  it('it can run a simple sync async sequence', (done) => {
    ruit(squareAsync, addOne, 1)
      .then(result => {
        assert.equal(result, 4)
        done()
      })
  })

  it('compose multiple ruit sequences', (done) => {
    const addAndSquare = ruit(squareAsync, addOneAsync, 1)
    ruit(divideBy2, addAndSquare).then(result => {
      assert.equal(result, 2)
      done()
    })
  })

  it('it can cancel the sequence chain', (done) => {
    const addAndSquare = ruit(squareAsync, addOneAsync, 1)
    ruit(ruit.cancel(), addAndSquare).then(result => {
      throw new Error('it should never come here')
    })

    setTimeout(() => done(), 1000)
  })
})
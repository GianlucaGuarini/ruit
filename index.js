(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ruit = factory());
}(this, (function () { 'use strict';

ruit.CANCEL = Symbol();
/**
 * Helper that can be used to cancel the tasks chain
 * @returns { Symbol } internal private constant
 */
ruit.cancel = function () { return ruit.CANCEL; };

/**
 * Serialize a list of sync and async tasks
 * @param   { * } tasks - list of tasks to process sequentially from right to left
 * @returns { Promise } a promise containing the result of the whole chain
 * @example
 *
 * const addOne = (num) => num + 1
 *
 * const squareAsync = (num) => {
 *   return new Promise(r => {
 *     setTimeout(r, 500, num * 2)
 *   })
 * }
 *
 * // a -> a + a -> a * 2
 * // basically from right to left: 1 => 1 + 1 => 2 * 2
 * ruit(squareAsync, addOne, 1)
 *   .then(result => {
 *     console.log(result) // 4
 *   })
 */
function ruit() {
  var tasks = [], len = arguments.length;
  while ( len-- ) tasks[ len ] = arguments[ len ];

  return new Promise(function (resolve) {
    return (function run(result) {
      if (!tasks.length) { return resolve(result) }

      var task = tasks.pop();
      var value = typeof task === 'function' ? task(result) : task;
      var done = function (data) { return run(data); };

      if (value === ruit.CANCEL) { return }
      if (value.then) { return value.then(done) }

      return Promise.resolve(done(value))
    })()
  })
}

return ruit;

})));

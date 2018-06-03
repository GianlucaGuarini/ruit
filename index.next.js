/**
 * Cancel token
 * @private
 * @type { Symbol }
 */
const CANCEL = Symbol()

/**
 * Helper that can be returned by ruit function to cancel the tasks chain
 * @returns { Symbol } internal private constant
 * @example
 *
 * ruit(
 *   100,
 *   num => Math.random() * num
 *   num => num > 50 ? ruit.cancel() : num
 *   num => num - 2
 * ).then(result => {
 *   console.log(result) // here we will get only number lower than 50
 * })
 *
 */
ruit.cancel = () => CANCEL

/**
 * The same as ruit() but with the arguments inverted from right to left
 * @param   { * } tasks - list of tasks to process sequentially
 * @returns { Promise } a promise containing the result of the whole chain
 * @example
 *
 * const curry = f => a => b => f(a, b)
 * const add = (a, b) => a + b
 *
 * const addOne = curry(add)(1)
 *
 * const squareAsync = (num) => {
 *   return new Promise(r => {
 *     setTimeout(r, 500, num * 2)
 *   })
 * }
 *
 * // a -> a + a -> a * 2
 * // basically from right to left: 1 => 1 + 1 => 2 * 2
 * ruit.compose(squareAsync, addOne, 1).then(result => console.log(result)) // 4
 */
ruit.compose = (...tasks) => ruit(...tasks.reverse())

/**
 * Serialize a list of sync and async tasks from left to right
 * @param   { * } tasks - list of tasks to process sequentially
 * @returns { Promise } a promise containing the result of the whole chain
 * @example
 *
 * const curry = f => a => b => f(a, b)
 * const add = (a, b) => a + b
 *
 * const addOne = curry(add)(1)
 *
 * const squareAsync = (num) => {
 *   return new Promise(r => {
 *     setTimeout(r, 500, num * 2)
 *   })
 * }
 *
 * // a -> a + a -> a * 2
 * // basically from left to right: 1 => 1 + 1 => 2 * 2
 * ruit(1, addOne, squareAsync).then(result => console.log(result)) // 4
 */
export default function ruit(...tasks) {
  return new Promise((resolve, reject) => {
    return (function run(queue, result) {
      if (!queue.length) return resolve(result)

      const [task, ...rest] = queue
      const value = typeof task === 'function' ? task(result) : task
      const done = v => run(rest, v)

      // check against nil values
      if (value != null) {
        if (value === CANCEL) return
        if (value.then) return value.then(done, reject)
      }

      return Promise.resolve(done(value))
    })(tasks)
  })
}
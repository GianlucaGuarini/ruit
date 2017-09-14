ruit.CANCEL = Symbol()
/**
 * Helper that can be used to cancel the tasks chain
 * @returns { Symbol } internal private constant
 */
ruit.cancel = () => ruit.CANCEL

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
export default function ruit(...tasks) {
  return new Promise(resolve => {
    return (function run(result) {
      if (!tasks.length) return resolve(result)

      const task = tasks.pop()
      const value = typeof task === 'function' ? task(result) : task
      const done = (data) => run(data)

      if (value === ruit.CANCEL) return
      if (value.then) return value.then(done)

      return Promise.resolve(done(value))
    })()
  })
}
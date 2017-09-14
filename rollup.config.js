import buble from 'rollup-plugin-buble'
export default {
  entry: 'index.next.js',
  plugins: [buble()],
  targets: [
    {
      moduleName: 'ruit',
      dest: 'index.js',
      format: 'umd'
    }
  ]
}
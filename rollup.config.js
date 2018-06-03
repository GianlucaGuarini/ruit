import buble from 'rollup-plugin-buble'
export default {
  input: 'index.next.js',
  plugins: [buble()],
  output: [
    {
      name: 'ruit',
      file: 'index.js',
      format: 'umd'
    }
  ]
}
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { minify } from 'rollup-plugin-swc-minify'

export default {
  input: 'src/ajv.js',
  output: {
    file: 'web/ajv.min.js',
    format: 'umd',
    name: 'ajv',
    sourcemap: true,
    plugins: [minify()]
  },
  plugins: [nodeResolve({
    preferBuiltins: false,
    browser: true
  }), commonjs(), json()]
}

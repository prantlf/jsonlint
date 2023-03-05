import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { minify } from 'rollup-plugin-swc-minify'

export default {
  input: 'src/ajv7.js',
  output: {
    file: 'web/ajv7.min.js',
    format: 'umd',
    name: 'ajv7',
    sourcemap: true,
    plugins: [minify()]
  },
  plugins: [nodeResolve({ browser: true }), commonjs(), json()]
}

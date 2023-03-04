const test = require('tehanu')(__filename)
const assert = require('assert')

const fs = require('fs')
const path = require('path')
const YAML = require('js-yaml')

const { parse } = require('..')

const schema = YAML.DEFAULT_SCHEMA.extend([
  new YAML.Type('!error', {
    kind: 'scalar',
    resolve: function (/* state */) {
      // state.result = null
      return true
    }
  })
])

const tests = YAML.load(fs.readFileSync(
  path.join(__dirname, '/portable.yaml'), 'utf8'), {
  schema
})

if (!Object.is) {
  Object.defineProperty(Object, 'is', {
    value: function (x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y
      }
      return false
    },
    configurable: true,
    enumerable: false,
    writable: true
  })
}

for (const k in tests) {
  (function (k) {
    test(k, function () {
      let result
      try {
        result = parse(tests[k].input, { mode: 'json5' })
      } catch {
        result = null
      }

      // need deepStrictEqual
      if (typeof (result) === 'object') {
        assert.deepEqual(result, tests[k].output)
      } else {
        assert(Object.is(result, tests[k].output), String(result) + ' == ' + tests[k].output)
      }
    })
  })(k)
}

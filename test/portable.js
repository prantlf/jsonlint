/* eslint-disable node/no-deprecated-api */
/* globals it */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const YAML = require('js-yaml')
const parse = require('..').parse

function addTest (name, fn) {
  if (typeof (describe) === 'function') {
    it(name, fn)
  } else {
    exports['test ' + name] = fn
  }
}

const schema = YAML.Schema.create([
  new YAML.Type('!error', {
    kind: 'scalar',
    resolve: function (state) {
      // state.result = null
      return true
    }
  })
])

const tests = YAML.safeLoad(fs.readFileSync(
  path.join(__dirname, '/portable.yaml'), 'utf8'), {
  schema: schema
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
    addTest(k, function () {
      let result
      try {
        result = parse(tests[k].input, { mode: 'json5' })
      } catch (err) {
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

if (require.main === module) { require('test').run(exports) }

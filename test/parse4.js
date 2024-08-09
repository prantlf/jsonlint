const test = require('tehanu')(__filename)
const assert = require('node:assert')

const { parse } = require('..')

test('plain json', function () {
  assert.deepEqual(parse('{ "c": 123 }', { legacy: true }), { c: 123 })
  assert.deepEqual(parse('{ "c": 123 }', { mode: 'json' }), { c: 123 })
  assert.deepEqual(parse('{ "c": 123 }', { mode: 'cjson' }), { c: 123 })
  assert.deepEqual(parse('{ "c": 123 }', { mode: 'json5' }), { c: 123 })
})

test('cjson', function () {
  assert.throws(function () {
    parse('{ "c": /* foo */ 123 }', { legacy: true })
  }, /(?:Unexpected token "?\/"?)|(?:No value found for key "c")/)
  assert.throws(function () {
    parse('{ "c": /* foo */ 123 }', { mode: 'json' })
  }, /(?:Unexpected token "?\/"?)|(?:No value found for key "c")/)
  assert.deepEqual(parse('{ "c": /* foo */ 123 }', { mode: 'cjson' }), { c: 123 })
  assert.deepEqual(parse('{ "c": /* foo */ 123 }', { mode: 'json5' }), { c: 123 })
})

test('json5', function () {
  assert.throws(function () {
    parse('{ "c": Infinity }', { legacy: true })
  }, /(?:Unexpected token "?I"?)|(?:No value found for key "c")/)
  assert.throws(function () {
    parse('{ "c": Infinity }', { mode: 'json' })
  }, /(?:Unexpected token "?I"?)|(?:No value found for key "c")/)
  assert.throws(function () {
    parse('{ "c": Infinity }', { mode: 'cjson' })
  }, /(?:Unexpected token "?I"?)|(?:No value found for key "c")/)
  assert.deepEqual(parse('{ "c": Infinity }', { mode: 'json5' }), { c: Number.POSITIVE_INFINITY })
})

/* eslint-disable no-eval */

const assert = require('assert')
const parse = require('..').parseCustom

assert.deepEqual({}, parse('{}'))
assert.deepEqual({ 42: 37 }, parse('{"42":37}'))
assert.deepEqual(null, parse('null'))
assert.deepEqual(true, parse('true'))
assert.deepEqual(false, parse('false'))
assert.deepEqual('foo', parse('"foo"'))
assert.deepEqual('f\no', parse('"f\\no"'))
assert.deepEqual('\b\f\n\r\t"\u2028/\\',
  parse('"\\b\\f\\n\\r\\t\\"\\u2028\\/\\\\"'))
assert.deepEqual([1.1], parse('[1.1]'))
assert.deepEqual([1], parse('[1.0]'))

assert.deepEqual(0, parse('0'))
assert.deepEqual(1, parse('1'))
assert.deepEqual(0.1, parse('0.1'))
assert.deepEqual(1.1, parse('1.1'))
assert.deepEqual(1.1, parse('1.100000'))
assert.deepEqual(1.111111, parse('1.111111'))
assert.deepEqual(-0, parse('-0'))
assert.deepEqual(-1, parse('-1'))
assert.deepEqual(-0.1, parse('-0.1'))
assert.deepEqual(-1.1, parse('-1.1'))
assert.deepEqual(-1.1, parse('-1.100000'))
assert.deepEqual(-1.111111, parse('-1.111111'))
assert.deepEqual(11, parse('1.1e1'))
assert.deepEqual(11, parse('1.1e+1'))
assert.deepEqual(0.11, parse('1.1e-1'))
assert.deepEqual(11, parse('1.1E1'))
assert.deepEqual(11, parse('1.1E+1'))
assert.deepEqual(0.11, parse('1.1E-1'))

assert.deepEqual([], parse('[]'))
assert.deepEqual([1], parse('[1]'))
assert.deepEqual([1, '2', true, null], parse('[1, "2", true, null]'))

assert.deepEqual('', parse('""'))
assert.deepEqual(['', '', -0, ''], parse('[    ""  ,    ""  ,   -0,    ""]'))
assert.deepEqual('', parse('""'))

function getFilter (name) {
  name = String(name)
  function filter (key, value) {
    return (key === name) ? undefined : value
  }
  return filter
}

const pointJson = '{"x": 1, "y": 2}'
assert.deepEqual({ x: 1, y: 2 }, parse(pointJson))
assert.deepEqual({ x: 1 }, parse(pointJson, getFilter('y')))
assert.deepEqual({ y: 2 }, parse(pointJson, getFilter('x')))
assert.deepEqual([1, 2, 3], parse('[1, 2, 3]'))
let arrayWithHole = [1]
++arrayWithHole.length
arrayWithHole.push(3)
assert.deepEqual(arrayWithHole, parse('[1, 2, 3]', getFilter(1)))
arrayWithHole = [1, 2]
++arrayWithHole.length
assert.deepEqual(arrayWithHole, parse('[1, 2, 3]', getFilter(2)))

function DoubleNumbers (key, value) {
  return (typeof value === 'number') ? 2 * value : value
}

const deepObject = '{"a": {"b": 1, "c": 2}, "d": {"e": {"f": 3}}}'
assert.deepEqual({ a: { b: 1, c: 2 }, d: { e: { f: 3 } } },
  parse(deepObject))
assert.deepEqual({ a: { b: 2, c: 4 }, d: { e: { f: 6 } } },
  parse(deepObject, DoubleNumbers))

function testInvalid (input) {
  assert.throws(function () {
    parse(input)
  })
}

testInvalid('abcdef')
testInvalid('isNaN()')
testInvalid('{"x": [1, 2, deepObject]}')
testInvalid('[1, [2, [deepObject], 3], 4]')
testInvalid('function () { return 0; }')

testInvalid('[1, 2')
testInvalid('{"x": 3')

// JavaScript number literals not valid in JSON.
testInvalid('[01]')
testInvalid('[.1]')
testInvalid('[1.]')
testInvalid('[1.e1]')
testInvalid('[-.1]')
testInvalid('[-1.]')

// Plain invalid number literals.
testInvalid('-')
testInvalid('--1')
testInvalid('-1e')
testInvalid('1e--1]')
testInvalid('1e+-1')
testInvalid('1e-+1')
testInvalid('1e++1')

// JavaScript string literals not valid in JSON.
testInvalid("'single quote'") // Valid JavaScript
testInvalid('"\\a invalid escape"')
testInvalid('"\\v invalid escape"') // Valid JavaScript
testInvalid('"\\\' invalid escape"') // Valid JavaScript
testInvalid('"\\x42 invalid escape"') // Valid JavaScript
testInvalid('"\\u202 invalid escape"')
testInvalid('"\\012 invalid escape"')
testInvalid('"Unterminated string')
testInvalid('"Unterminated string\\"')
testInvalid('"Unterminated string\\\\\\"')

// Test bad JSON that would be good JavaScript (ES5).
testInvalid('{true:42}')
testInvalid('{false:42}')
testInvalid('{null:42}')
testInvalid("{'foo':42}")
testInvalid('{42:42}')
testInvalid('{0:42}')
testInvalid('{-1:42}')

// Test for trailing garbage detection.
testInvalid('42 px')
testInvalid('42 .2')
testInvalid('42 2')
testInvalid('42 e1')
testInvalid('"42" ""')
testInvalid('"42" ""')
testInvalid('"" ""')
testInvalid('true ""')
testInvalid('false ""')
testInvalid('null ""')
testInvalid('null ""')
testInvalid('[] ""')
testInvalid('[true] ""')
testInvalid('{} ""')
testInvalid('{"x":true} ""')
testInvalid('"Garbage""After string"')

testInvalid('1); throw "foo"; (1')

let x = 0 // eslint-disable-line no-unused-vars, prefer-const
eval('(1); x++; (1)')
testInvalid('1); x++; (1')

// Test string conversion of argument.
const o = { toString: function () { return '42' } }
assert.deepEqual(42, parse(o))

let str = '[1]'
for (let i = 0; i < 100000; i++) {
  str = '[1,' + str + ']'
}

assert.throws(function () {
  parse(str)
})

/* eslint-disable node/no-deprecated-api */
/* globals it */

const assert = require('assert')
const exported = require('../lib/jsonlint')
const tokenize = exported.tokenize

function addTest (description, test) {
  if (typeof describe === 'function') {
    it(description, test)
  } else {
    exports['test tokenize: ' + description] = test
  }
}

function addDataTest (input, tokens) {
  function test () {
    const result = tokenize(input, {
      mode: 'json5',
      rawTokens: true,
      tokenLocations: true,
      tokenPaths: true
    })
    const output = result
      .map(function (token) {
        return token.raw
      })
      .join('')
    assert.deepEqual(output, input)
    result.forEach(function (item) {
      assert.equal(typeof item, 'object')
      assert.equal(typeof item.location, 'object')
      assert.equal(typeof item.location.start, 'object')
      assert.equal(typeof item.location.start.column, 'number')
      assert.equal(typeof item.location.start.line, 'number')
      assert.equal(typeof item.location.start.offset, 'number')
      assert.ok(Array.isArray(item.path))
      delete item.location
      delete item.path
    })
    assert.deepEqual(result, tokens)
  }
  addTest(JSON.stringify(input), test)
}

addDataTest('123', [{ type: 'literal', raw: '123', value: 123 }])

addDataTest(' /* zz */\r\n true /* zz */\n',
  [{ type: 'whitespace', raw: ' ' },
    { type: 'comment', raw: '/* zz */' },
    { type: 'whitespace', raw: '\r\n ' },
    { type: 'literal', raw: 'true', value: true },
    { type: 'whitespace', raw: ' ' },
    { type: 'comment', raw: '/* zz */' },
    { type: 'whitespace', raw: '\n' }])

addDataTest('{q:123,  w : /*zz*/\n\r 345 } ',
  [{ type: 'symbol', raw: '{', value: '{' },
    { type: 'literal', raw: 'q', value: 'q' },
    { type: 'symbol', raw: ':', value: ':' },
    { type: 'literal', raw: '123', value: 123 },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'whitespace', raw: '  ' },
    { type: 'literal', raw: 'w', value: 'w' },
    { type: 'whitespace', raw: ' ' },
    { type: 'symbol', raw: ':', value: ':' },
    { type: 'whitespace', raw: ' ' },
    { type: 'comment', raw: '/*zz*/' },
    { type: 'whitespace', raw: '\n\r ' },
    { type: 'literal', raw: '345', value: 345 },
    { type: 'whitespace', raw: ' ' },
    { type: 'symbol', raw: '}', value: '}' },
    { type: 'whitespace', raw: ' ' }])

addDataTest('null /* */// xxx\n//xxx',
  [{ type: 'literal', raw: 'null', value: null },
    { type: 'whitespace', raw: ' ' },
    { type: 'comment', raw: '/* */' },
    { type: 'comment', raw: '// xxx' },
    { type: 'whitespace', raw: '\n' },
    { type: 'comment', raw: '//xxx' }])

addDataTest('[1,2,[[],[1]],{},{1:2},{q:{q:{}}},]',
  [{ type: 'symbol', raw: '[', value: '[' },
    { type: 'literal', raw: '1', value: 1 },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'literal', raw: '2', value: 2 },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'symbol', raw: '[', value: '[' },
    { type: 'symbol', raw: '[', value: '[' },
    { type: 'symbol', raw: ']', value: ']' },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'symbol', raw: '[', value: '[' },
    { type: 'literal', raw: '1', value: 1 },
    { type: 'symbol', raw: ']', value: ']' },
    { type: 'symbol', raw: ']', value: ']' },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'symbol', raw: '{', value: '{' },
    { type: 'symbol', raw: '}', value: '}' },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'symbol', raw: '{', value: '{' },
    { type: 'literal', raw: '1', value: 1 },
    { type: 'symbol', raw: ':', value: ':' },
    { type: 'literal', raw: '2', value: 2 },
    { type: 'symbol', raw: '}', value: '}' },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'symbol', raw: '{', value: '{' },
    { type: 'literal', raw: 'q', value: 'q' },
    { type: 'symbol', raw: ':', value: ':' },
    { type: 'symbol', raw: '{', value: '{' },
    { type: 'literal', raw: 'q', value: 'q' },
    { type: 'symbol', raw: ':', value: ':' },
    { type: 'symbol', raw: '{', value: '{' },
    { type: 'symbol', raw: '}', value: '}' },
    { type: 'symbol', raw: '}', value: '}' },
    { type: 'symbol', raw: '}', value: '}' },
    { type: 'symbol', raw: ',', value: ',' },
    { type: 'symbol', raw: ']', value: ']' }])

addTest('without raw input, location and path properties', function () {
  const result = tokenize('{q:123,  w : /*zz*/\n\r "ab" } ', { mode: 'json5' })
  result.forEach(function (item) {
    assert.equal(typeof item, 'object')
    assert.equal(typeof item.raw, 'undefined')
    assert.equal(typeof item.location, 'undefined')
    assert.equal(typeof item.path, 'undefined')
  })
})

addTest('does not enforce tokenization in the input options', function () {
  const options = {}
  tokenize('{}', options)
  assert.equal(options.tokenize, undefined)
})

if (require.main === module) { require('test').run(exports) }

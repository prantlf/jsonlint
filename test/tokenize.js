const test = require('tehanu')(__filename)
const assert = require('node:assert')

const { tokenize } = require('../lib/jsonlint')

function addTest (input, tokens) {
  test(JSON.stringify(input), function () {
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
    for (const item of result) {
      assert.equal(typeof item, 'object')
      assert.equal(typeof item.location, 'object')
      assert.equal(typeof item.location.start, 'object')
      assert.equal(typeof item.location.start.column, 'number')
      assert.equal(typeof item.location.start.line, 'number')
      assert.equal(typeof item.location.start.offset, 'number')
      assert.ok(Array.isArray(item.path))
      delete item.location
      delete item.path
    }
    assert.deepEqual(result, tokens)
  })
}

addTest('123', [{ type: 'literal', raw: '123', value: 123 }])

addTest(' /* zz */\r\n true /* zz */\n',
  [{ type: 'whitespace', raw: ' ' },
    { type: 'comment', raw: '/* zz */' },
    { type: 'whitespace', raw: '\r\n ' },
    { type: 'literal', raw: 'true', value: true },
    { type: 'whitespace', raw: ' ' },
    { type: 'comment', raw: '/* zz */' },
    { type: 'whitespace', raw: '\n' }])

addTest('{q:123,  w : /*zz*/\n\r 345 } ',
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

addTest('null /* */// xxx\n//xxx',
  [{ type: 'literal', raw: 'null', value: null },
    { type: 'whitespace', raw: ' ' },
    { type: 'comment', raw: '/* */' },
    { type: 'comment', raw: '// xxx' },
    { type: 'whitespace', raw: '\n' },
    { type: 'comment', raw: '//xxx' }])

addTest('[1,2,[[],[1]],{},{1:2},{q:{q:{}}},]',
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

test('without raw input, location and path properties', function () {
  const result = tokenize('{q:123,  w : /*zz*/\n\r "ab" } ', { mode: 'json5' })
  for (const item of result) {
    assert.equal(typeof item, 'object')
    assert.equal(typeof item.raw, 'undefined')
    assert.equal(typeof item.location, 'undefined')
    assert.equal(typeof item.path, 'undefined')
  }
})

test('does not enforce tokenization in the input options', function () {
  const options = {}
  tokenize('{}', options)
  assert.equal(options.tokenize, undefined)
})

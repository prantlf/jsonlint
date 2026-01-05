const test = require('tehanu')(__filename)
const assert = require('node:assert')

const { print } = require('../lib/printer')

const mixedTokens = [ // '/* start */{ "a":1, // c\n"0b": [ 2,3 ]}'
  { type: 'comment', raw: '/* start */' },
  { type: 'symbol', raw: '{', value: '{' },
  { type: 'whitespace', raw: ' ' },
  { type: 'literal', raw: '"a"', value: 'a' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'literal', raw: '1', value: 1 },
  { type: 'symbol', raw: ',', value: ',' },
  { type: 'whitespace', raw: ' ' },
  { type: 'comment', raw: '// c' },
  { type: 'whitespace', raw: '\n' },
  { type: 'literal', raw: '"0b"', value: '0b' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'whitespace', raw: ' ' },
  { type: 'symbol', raw: '[', value: '[' },
  { type: 'whitespace', raw: ' ' },
  { type: 'literal', raw: '2', value: 2 },
  { type: 'symbol', raw: ',', value: ',' },
  { type: 'literal', raw: '3', value: 3 },
  { type: 'whitespace', raw: ' ' },
  { type: 'symbol', raw: ']', value: ']' },
  { type: 'symbol', raw: '}', value: '}' }
]

// `// test
// {// test
// // test
// a:/* test */1,// test
// b:2// test
// // test
// }// test
// // test`
const commentTokens = [
  { type: 'comment', raw: '// test' },
  { type: 'whitespace', raw: '\n' },
  { type: 'symbol', raw: '{', value: '{' },
  { type: 'comment', raw: '// test' },
  { type: 'whitespace', raw: '\n' },
  { type: 'comment', raw: '// test' },
  { type: 'whitespace', raw: '\n' },
  { type: 'literal', raw: 'a', value: 'a' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'comment', raw: '/* test */' },
  { type: 'literal', raw: '1', value: 1 },
  { type: 'symbol', raw: ',', value: ',' },
  { type: 'comment', raw: '// test' },
  { type: 'whitespace', raw: '\n' },
  { type: 'literal', raw: 'b', value: 'b' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'literal', raw: '2', value: 2 },
  { type: 'comment', raw: '// test' },
  { type: 'whitespace', raw: '\n' },
  { type: 'comment', raw: '// test' },
  { type: 'whitespace', raw: '\n' },
  { type: 'symbol', raw: '}', value: '}' },
  { type: 'comment', raw: '// test' },
  { type: 'whitespace', raw: '\n' },
  { type: 'comment', raw: '// test' }
]

// `{
// // String parameter
// "key": 'value',
// }`
const stringTokens = [
  { type: 'symbol', raw: '{', value: '{' },
  { type: 'whitespace', raw: '\n' },
  { type: 'comment', raw: '// String parameter' },
  { type: 'whitespace', raw: '\n' },
  { type: 'literal', raw: '"key"', value: 'key' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'whitespace', raw: ' ' },
  { type: 'literal', raw: '\'value\'', value: 'value' },
  { type: 'symbol', raw: ',', value: ',' },
  { type: 'whitespace', raw: '\n' },
  { type: 'symbol', raw: '}', value: '}' }
]

test('concatenate tokens', function () {
  const output = print(mixedTokens)
  assert.equal(output, '/* start */{ "a":1, // c\n"0b": [ 2,3 ]}')
})

test('omit whitespace', function () {
  const output = print(mixedTokens, {})
  assert.equal(output, '/* start */{"a":1,/* c */"0b":[2,3]}')
})

test('introduce line breaks', function () {
  const output = print(mixedTokens, { indent: '' })
  assert.equal(output, '/* start */\n{\n"a": 1, // c\n"0b": [\n2,\n3\n]\n}')
})

test('apply indent', function () {
  const output = print(mixedTokens, { indent: 2 })
  assert.equal(output, '/* start */\n{\n  "a": 1, // c\n  "0b": [\n    2,\n    3\n  ]\n}')
})

test('omit comments', function () {
  const output = print(mixedTokens, { pruneComments: true })
  assert.equal(output, '{"a":1,"0b":[2,3]}')
})

test('strip quotes from object keys', function () {
  const output = print(mixedTokens, { stripObjectKeys: true })
  assert.equal(output, '/* start */{a:1,/* c */"0b":[2,3]}')
})

test('keep comment locations', function () {
  const output = print(commentTokens, { indent: '  ' })
  assert.equal(output, '// test\n{ // test\n  // test\n  a: /* test */ 1, // test\n  b: 2 // test\n  // test\n} // test\n// test')
  // `// test
  // { // test
  //   // test
  //   a: /* test */ 1, // test
  //   b: 2 // test
  //   // test
  // } // test
  // // test`
})

test('keep comment after opening an object scope indented', function () {
  const output = print(stringTokens, { indent: '  ' })
  assert.equal(output, '{\n  // String parameter\n  "key": \'value\',\n  \n}')
  // `{
  // // String parameter
  // "key": 'value',
  // }`
})

test('enforce double quotes', function () {
  const output = print(stringTokens, { enforceDoubleQuotes: true })
  assert.equal(output, '{/* String parameter */"key":"value",}')
})

test('enforce single quotes', function () {
  const output = print(stringTokens, { enforceSingleQuotes: true })
  assert.equal(output, '{/* String parameter */\'key\':\'value\',}')
})

test('enforce double quotes, but strip quotes from object keys', function () {
  const output = print(stringTokens, {
    stripObjectKeys: true,
    enforceDoubleQuotes: true
  })
  assert.equal(output, '{/* String parameter */key:"value",}')
})

test('trim trailing commas', function () {
  const output = print(stringTokens, { trimTrailingCommas: true })
  assert.equal(output, '{/* String parameter */"key":\'value\'}')
})

const emptyObjectTokens = [
  { type: 'symbol', raw: '{', value: '{' },
  { type: 'whitespace', raw: '\n' },
  { type: 'literal', raw: '"object"', value: 'object' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'whitespace', raw: ' ' },
  { type: 'symbol', raw: '{', value: '{' },
  { type: 'symbol', raw: '}', value: '}' },
  { type: 'symbol', raw: ',', value: ',' },
  { type: 'whitespace', raw: '\n' },
  { type: 'literal', raw: '"array"', value: 'array' },
  { type: 'symbol', raw: ':', value: ':' },
  { type: 'whitespace', raw: ' ' },
  { type: 'symbol', raw: '[', value: '[' },
  { type: 'symbol', raw: ']', value: ']' },
  { type: 'whitespace', raw: '\n' },
  { type: 'symbol', raw: '}', value: '}' }
]

test('keeps compact empty objects and arrays by default', function () {
  const output = print(emptyObjectTokens, { indent: 2 })
  assert.equal(output, '{\n  "object": {},\n  "array": []\n}')
})

test('inserts extra line break into empty objects', function () {
  const output = print(emptyObjectTokens, { indent: 2, compactEmptyObjects: false })
  assert.equal(output, '{\n  "object": {\n  },\n  "array": [\n  ]\n}')
})

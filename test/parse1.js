const test = require('tehanu')(__filename)
const assert = require('assert')

const fs = require('fs')
const path = require('path')

const exported = require('../lib/jsonlint')
const validator = require('../lib/validator')

const nativeParser = process.argv[2] === '--native-parser'
const parse = nativeParser ? exported.parseNative : exported.parseCustom

function checkErrorInformation (error) {
  assert.equal(typeof error.message, 'string')
  assert.equal(typeof error.reason, 'string')
  assert.equal(typeof error.excerpt, 'string')
  assert.equal(typeof error.pointer, 'string')
  assert.equal(typeof error.location, 'object')
  assert.equal(typeof error.location.start, 'object')
  assert.equal(typeof error.location.start.line, 'number')
  assert.equal(typeof error.location.start.column, 'number')
  assert.equal(typeof error.location.start.offset, 'number')
}

test('test exported interface', function () {
  assert.equal(typeof parse, 'function')
})

test('test function', function () {
  const json = '{"foo": "bar"}'
  assert.deepEqual(parse(json), { foo: 'bar' })
})

test('test limited error information', function () {
  const json = '{"foo": ?}'
  try {
    parse(json)
    assert.fail()
  } catch (error) {
    checkErrorInformation(error)
  }
})

test('test object', function () {
  const json = '{"foo": "bar"}'
  assert.deepEqual(parse(json), { foo: 'bar' })
})

test('test escaped backslash', function () {
  const json = '{"foo": "\\\\"}'
  assert.deepEqual(parse(json), { foo: '\\' })
})

test('test escaped chars', function () {
  const json = '{"foo": "\\\\\\""}'
  assert.deepEqual(parse(json), { foo: '\\"' })
})

test('test escaped \\n', function () {
  const json = '{"foo": "\\\\\\n"}'
  assert.deepEqual(parse(json), { foo: '\\\n' })
})

test('test string with escaped line break', function () {
  const json = '{"foo": "bar\\nbar"}'
  assert.deepEqual(parse(json), { foo: 'bar\nbar' })
  assert.equal(JSON.stringify(parse(json)).length, 18)
})

test('test string with line break', function () {
  const json = '{"foo": "bar\nbar"}'
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test string literal', function () {
  const json = '"foo"'
  assert.equal(parse(json), 'foo')
})

test('test number literal', function () {
  const json = '1234'
  assert.equal(parse(json), 1234)
})

test('test null literal', function () {
  const json = '1234'
  assert.equal(parse(json), 1234)
})

test('test boolean literal', function () {
  const json = 'true'
  assert.equal(parse(json), true)
})

test('test unclosed array', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/2.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test unquotedkey keys must be quoted', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/3.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra comma', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/4.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test double extra comma', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/5.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test missing value', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/6.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test comma after the close', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/7.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra close', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/8.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra comma after value', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/9.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra value after close with misplaced quotes', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/10.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test illegal expression addition', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/11.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test illegal invocation of alert', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/12.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test numbers cannot have leading zeroes', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/13.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test numbers cannot be hex', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/14.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test illegal backslash escape \\0', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/15.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test unquoted text', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/16.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test illegal backslash escape \\x', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/17.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test missing colon', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/19.json'))
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test double colon', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/20.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test comma instead of colon', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/21.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test colon instead of comma', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/22.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test bad raw value', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/23.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test single quotes', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/24.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test tab character in string', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/25.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test tab character in string 2', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/26.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test line break in string', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/27.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test line break in string in array', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/28.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test 0e', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/29.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test 0e+', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/30.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test 0e+ 1', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/31.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test comma instead of closing brace', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/32.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test bracket mismatch', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/33.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra brace', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/34.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test failing with bom', function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/bom.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
})

if (!nativeParser) {
  test('test ignoring bom', function () {
    const json = fs.readFileSync(path.join(__dirname, '/fails/bom.json')).toString()
    assert.deepEqual(parse(json, { ignoreBOM: true }), { bom: 'utf8' })
  })
}

test('test error location with Windows line breaks using the native parser', function () {
  const json = '{\r\n"foo": {\r\n      "bar":\r\n    }\r\n  \r\n  }'
  try {
    exported.parseNative(json)
    assert.fail('should throw error')
  } catch (error) {
    assert.equal(error.excerpt, '...      "bar":    }    }')
    assert.equal(error.pointer, '-------------------^')
    assert.equal(error.reason, 'Unexpected token }')
    assert.deepEqual(error.location, {
      start: { column: 5, line: 4, offset: 31 }
    })
    assert.equal(error.message, 'Parse error on line 4, column 5:\n...      "bar":    }    }\n-------------------^\nUnexpected token }')
  }
})

test('test error location with Windows line breaks using the custom parser', function () {
  const json = '{\r\n"foo": {\r\n      "bar":\r\n    }\r\n  \r\n  }'
  try {
    exported.parseCustom(json)
    assert.fail('should throw error')
  } catch (error) {
    assert.equal(error.excerpt, '...      "bar":    }    }')
    assert.equal(error.pointer, '-------------------^')
    assert.equal(error.reason, 'No value found for key "bar"')
    assert.deepEqual(error.location, {
      start: { column: 5, line: 4, offset: 31 }
    })
    assert.equal(error.message, 'Parse error on line 4, column 5:\n...      "bar":    }    }\n-------------------^\nNo value found for key "bar"')
  }
})

test('test pass-1', function () {
  const json = fs.readFileSync(path.join(__dirname, '/passes/1.json')).toString()
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
})

test('test pass-2', function () {
  const json = fs.readFileSync(path.join(__dirname, '/passes/2.json')).toString()
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
})

test('test pass-3', function () {
  const json = fs.readFileSync(path.join(__dirname, '/passes/data-04.json')).toString()
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
})

test('test schema validation success', function () {
  const data = fs.readFileSync(path.join(__dirname, '/passes/data-07.json')).toString()
  const schema = fs.readFileSync(path.join(__dirname, '/passes/schema-07.json')).toString()
  const validate = validator.compile(schema)
  assert.doesNotThrow(function () { validate(parse(data)) }, 'should pass')
})

test('test schema validation failure', function () {
  const data = fs.readFileSync(path.join(__dirname, '/passes/schema-04.json')).toString()
  const schema = fs.readFileSync(path.join(__dirname, '/passes/schema-04.json')).toString()
  const validate = validator.compile(schema, {
    ignoreComments: !nativeParser,
    environment: 'json-schema-draft-04'
  })
  assert.throws(function () {
    validate(data, { ignoreComments: !nativeParser })
  }, 'should throw error')
})

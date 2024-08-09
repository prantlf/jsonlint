const test = require('tehanu')(__filename)
const assert = require('node:assert')

const { readFileSync } = require('node:fs')
const { join } = require('node:path')

const exported = require('../lib/jsonlint')
const validator = require('../lib/validator')

const nativeParser = process.argv[2] === '--native-parser'
const parse = nativeParser ? exported.parseNative : exported.parseCustom

function readTestFile (name) {
  return readFileSync(join(__dirname, name), 'utf8')
}

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
  const json = readTestFile('/fails/2.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test unquotedkey keys must be quoted', function () {
  const json = readTestFile('/fails/3.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra comma', function () {
  const json = readTestFile('/fails/4.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test double extra comma', function () {
  const json = readTestFile('/fails/5.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test missing value', function () {
  const json = readTestFile('/fails/6.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test comma after the close', function () {
  const json = readTestFile('/fails/7.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra close', function () {
  const json = readTestFile('/fails/8.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra comma after value', function () {
  const json = readTestFile('/fails/9.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra value after close with misplaced quotes', function () {
  const json = readTestFile('/fails/10.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test illegal expression addition', function () {
  const json = readTestFile('/fails/11.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test illegal invocation of alert', function () {
  const json = readTestFile('/fails/12.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test numbers cannot have leading zeroes', function () {
  const json = readTestFile('/fails/13.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test numbers cannot be hex', function () {
  const json = readTestFile('/fails/14.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test illegal backslash escape \\0', function () {
  const json = readTestFile('/fails/15.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test unquoted text', function () {
  const json = readTestFile('/fails/16.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test illegal backslash escape \\x', function () {
  const json = readTestFile('/fails/17.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test missing colon', function () {
  const json = readTestFile('/fails/19.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test double colon', function () {
  const json = readTestFile('/fails/20.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test comma instead of colon', function () {
  const json = readTestFile('/fails/21.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test colon instead of comma', function () {
  const json = readTestFile('/fails/22.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test bad raw value', function () {
  const json = readTestFile('/fails/23.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test single quotes', function () {
  const json = readTestFile('/fails/24.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test tab character in string', function () {
  const json = readTestFile('/fails/25.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test tab character in string 2', function () {
  const json = readTestFile('/fails/26.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test line break in string', function () {
  const json = readTestFile('/fails/27.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test line break in string in array', function () {
  const json = readTestFile('/fails/28.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test 0e', function () {
  const json = readTestFile('/fails/29.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test 0e+', function () {
  const json = readTestFile('/fails/30.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test 0e+ 1', function () {
  const json = readTestFile('/fails/31.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test comma instead of closing brace', function () {
  const json = readTestFile('/fails/32.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test bracket mismatch', function () {
  const json = readTestFile('/fails/33.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test extra brace', function () {
  const json = readTestFile('/fails/34.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

test('test failing with bom', function () {
  const json = readTestFile('/fails/bom.json')
  assert.throws(function () { parse(json) }, 'should throw error')
})

if (!nativeParser) {
  test('test ignoring bom', function () {
    const json = readTestFile('/fails/bom.json')
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
    assert.equal(error.reason, 'No value found for key "bar"')
    assert.deepEqual(error.location, {
      start: { column: 5, line: 4, offset: 31 }
    })
    assert.equal(error.message, 'Parse error on line 4, column 5:\n...      "bar":    }    }\n-------------------^\nNo value found for key "bar"')
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
  const json = readTestFile('/passes/1.json')
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
})

test('test pass-2', function () {
  const json = readTestFile('/passes/2.json')
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
})

test('test pass-3', function () {
  const json = readTestFile('/passes/data-04.json')
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
})

test('test schema validation success', function () {
  const data = readTestFile('/passes/data-07.json')
  const schema = readTestFile('/passes/schema-07.json')
  const validate = validator.compile(schema)
  assert.doesNotThrow(function () { validate(parse(data)) }, 'should pass')
})

test('test schema validation failure', function () {
  const data = readTestFile('/passes/schema-04.json')
  const schema = readTestFile('/passes/schema-04.json')
  const validate = validator.compile(schema, {
    ignoreComments: !nativeParser,
    environment: 'json-schema-draft-04'
  })
  assert.throws(function () {
    validate(data, { ignoreComments: !nativeParser })
  }, 'should throw error')
})

test('test schema validation with internal dependencies', function () {
  const data = readTestFile('/passes/data-int-deps.json')
  const schema = readTestFile('/passes/schema-int-deps.json')
  const validate = validator.compile(schema, { environment: 'draft-2019-09' })
  assert.doesNotThrow(function () { validate(parse(data)) }, 'should pass')
})

test('test schema validation with external dependencies', function () {
  const data = readTestFile('/passes/data-ext-deps.json')
  const schemaMain = readTestFile('/passes/schema-ext-deps.json')
  const schemaString = readTestFile('/passes/schema-ext-deps-string.json')
  const schemaNumber = readTestFile('/passes/schema-ext-deps-number.json')
  const schemaPhone = readTestFile('/passes/schema-ext-deps-phone.json')
  const schemas = [schemaMain, schemaString, schemaNumber, schemaPhone]
  const validate = validator.compile(schemas, { environment: 'draft-2020-12' })
  assert.doesNotThrow(function () { validate(parse(data)) }, 'should pass')
})

test('test JSON Type Definitions validation success', function () {
  const data = readTestFile('/passes/data-jtd.json')
  const schema = readTestFile('/passes/schema-jtd.json')
  const validate = validator.compile(schema, { environment: 'jtd' })
  assert.doesNotThrow(function () { validate(parse(data)) }, 'should pass')
})

const fs = require('fs')
const path = require('path')

const assert = require('assert')

const exported = require('../lib/jsonlint')
let parse = exported.parse
const validator = require('../lib/validator')

const oldNode = process.version.startsWith('v4.')
const nativeParser = process.argv[2] === '--native-parser'
parse = nativeParser ? exported.parseNative : exported.parseCustom

function checkErrorInformation (error) {
  assert.equal(typeof error.message, 'string')
  assert.equal(typeof error.reason, 'string')
  assert.equal(typeof error.excerpt, 'string')
  if (!oldNode) {
    assert.equal(typeof error.pointer, 'string')
    assert.equal(typeof error.location, 'object')
    assert.equal(typeof error.location.start, 'object')
    assert.equal(typeof error.location.start.line, 'number')
    assert.equal(typeof error.location.start.column, 'number')
    assert.equal(typeof error.location.start.offset, 'number')
  }
}

exports['test exported interface'] = function () {
  assert.equal(typeof parse, 'function')
}

exports['test function'] = function () {
  const json = '{"foo": "bar"}'
  assert.deepEqual(parse(json), { foo: 'bar' })
}

exports['test limited error information'] = function () {
  const json = '{"foo": ?}'
  try {
    parse(json)
    assert.fail()
  } catch (error) {
    checkErrorInformation(error)
  }
}

exports['test object'] = function () {
  const json = '{"foo": "bar"}'
  assert.deepEqual(parse(json), { foo: 'bar' })
}

exports['test escaped backslash'] = function () {
  const json = '{"foo": "\\\\"}'
  assert.deepEqual(parse(json), { foo: '\\' })
}

exports['test escaped chars'] = function () {
  const json = '{"foo": "\\\\\\""}'
  assert.deepEqual(parse(json), { foo: '\\"' })
}

exports['test escaped \\n'] = function () {
  const json = '{"foo": "\\\\\\n"}'
  assert.deepEqual(parse(json), { foo: '\\\n' })
}

exports['test string with escaped line break'] = function () {
  const json = '{"foo": "bar\\nbar"}'
  assert.deepEqual(parse(json), { foo: 'bar\nbar' })
  assert.equal(JSON.stringify(parse(json)).length, 18)
}

exports['test string with line break'] = function () {
  const json = '{"foo": "bar\nbar"}'
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test string literal'] = function () {
  const json = '"foo"'
  assert.equal(parse(json), 'foo')
}

exports['test number literal'] = function () {
  const json = '1234'
  assert.equal(parse(json), 1234)
}

exports['test null literal'] = function () {
  const json = '1234'
  assert.equal(parse(json), 1234)
}

exports['test boolean literal'] = function () {
  const json = 'true'
  assert.equal(parse(json), true)
}

exports['test unclosed array'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/2.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test unquotedkey keys must be quoted'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/3.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test extra comma'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/4.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test double extra comma'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/5.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test missing value'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/6.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test comma after the close'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/7.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test extra close'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/8.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test extra comma after value'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/9.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test extra value after close with misplaced quotes'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/10.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test illegal expression addition'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/11.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test illegal invocation of alert'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/12.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test numbers cannot have leading zeroes'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/13.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test numbers cannot be hex'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/14.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test illegal backslash escape \\0'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/15.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test unquoted text'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/16.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test illegal backslash escape \\x'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/17.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test missing colon'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/19.json'))
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test double colon'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/20.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test comma instead of colon'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/21.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test colon instead of comma'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/22.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test bad raw value'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/23.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test single quotes'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/24.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test tab character in string'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/25.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test tab character in string 2'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/26.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test line break in string'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/27.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test line break in string in array'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/28.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test 0e'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/29.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test 0e+'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/30.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test 0e+ 1'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/31.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test comma instead of closing brace'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/32.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test bracket mismatch'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/33.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

exports['test extra brace'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/fails/34.json')).toString()
  assert.throws(function () { parse(json) }, 'should throw error')
}

if (!oldNode) {
  exports['test error location with Windows line breaks using the native parser'] = function () {
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
  }
}

exports['test error location with Windows line breaks using the custom parser'] = function () {
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
}

exports['test pass-1'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/passes/1.json')).toString()
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
}

exports['test pass-2'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/passes/2.json')).toString()
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
}

exports['test pass-3'] = function () {
  const json = fs.readFileSync(path.join(__dirname, '/passes/3.json')).toString()
  assert.doesNotThrow(function () { parse(json) }, 'should pass')
}

exports['test schema validation success'] = function () {
  const data = fs.readFileSync(path.join(__dirname, '/passes/3.json')).toString()
  const schema = fs.readFileSync(path.join(__dirname, '/passes/3.schema.json')).toString()
  const validate = validator.compile(schema)
  assert.doesNotThrow(function () { validate(parse(data)) }, 'should pass')
}

exports['test schema validation failure'] = function () {
  const data = fs.readFileSync(path.join(__dirname, '/passes/3.schema.json')).toString()
  const schema = fs.readFileSync(path.join(__dirname, '/passes/3.schema.json')).toString()
  const validate = validator.compile(schema, {
    ignoreComments: !nativeParser,
    environment: 'json-schema-draft-04'
  })
  assert.throws(function () {
    validate(data, { ignoreComments: !nativeParser })
  }, 'should throw error')
}

if (require.main === module) { require('test').run(exports) }

/* globals it */

const assert = require('assert')
const parse = require('..').parse

function addTest (arg, row, col, errRegExp) {
  const fn = function () {
    try {
      parse(arg, { mode: 'json5' })
    } catch (err) {
      if (row !== undefined) assert.equal(err.location.start.line, row, 'wrong row: ' + err.location.start.line)
      if (col !== undefined) assert.equal(err.location.start.column, col, 'wrong column: ' + err.location.start.column)
      try {
        if (errRegExp) assert(errRegExp.exec(err.message))
      } catch (error) {
        console.log('Message:', err.message)
        console.log('RegExp: ', errRegExp)
        throw error
      }
      return
    }
    throw Error('no error')
  }

  if (typeof (describe) === 'function') {
    it('test_errors: ' + JSON.stringify(arg), fn)
  } else {
    exports['test errors: ' + JSON.stringify(arg)] = fn
  }
}

// semicolon will be unexpected, so it indicates an error position
addTest(';', 1, 1)
addTest('\n\n\n;', 4, 1)
addTest('\r\n;', 2, 1)
addTest('\n\r;', 3, 1)
addTest('\n\u2028;', 3, 1)
addTest('\n\u2029;', 3, 1)
addTest('[\n1\n,\n;', 4, 1)
addTest('{\n;', 2, 1)
addTest('{\n1\n:\n;', 4, 1)
addTest('.e3', 1, 3, /"\.e3"/)

// line continuations
addTest('["\\\n",\n;', 3, 1)
addTest('["\\\r\n",\n;', 3, 1)
addTest('["\\\u2028",\n;', 3, 1)
addTest('["\\\u2029",\n;', 3, 1)

// bareword rewind
addTest('nulz', 1, 1)

// no data
addTest('  ', 1, 3, /No data.*whitespace/)
addTest('blah', 1, 1, /Unexpected token "b"/)
addTest('', 1, 1, /No data.*empty input/)

exports['test many nested object scopes'] = function () {
  try {
    parse('{{{{{{{{{', { mode: 'json5' })
  } catch (err) {
    const x = err.stack.match(/parseObject/g)
    assert(x.length === 4, "shouldn't blow up the stack with internal calls")
  }
}

if (require.main === module) { require('test').run(exports) }

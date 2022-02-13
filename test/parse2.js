/* eslint-disable node/no-deprecated-api, no-eval */
/* globals it */

const assert = require('assert')
const exported = require('..')
const parse = exported.parse
const parseNative = exported.parseNative
const parseCustom = exported.parseCustom

function addTest (arg, bulk, json5) {
  function testJSON5 () {
    let x
    try {
      x = parse(arg, { mode: 'json5' })
    } catch (err) {
      x = 'fail'
    }
    let z
    try {
      z = eval('(function(){"use strict"\nreturn (' + String(arg) + '\n)\n})()')
    } catch (err) {
      z = 'fail'
    }
    assert.deepEqual(x, z)
  }

  function testNativeJSON () {
    let x
    try {
      x = parseNative(arg)
    } catch (err) {
      x = 'fail'
    }
    let z
    try {
      z = JSON.parse(arg)
    } catch (err) {
      z = 'fail'
    }
    assert.deepEqual(x, z)
  }

  function testStrictJSON () {
    let x
    try {
      x = parseCustom(arg)
    } catch (err) {
      x = 'fail'
    }
    let z
    try {
      z = JSON.parse(arg)
    } catch (err) {
      z = 'fail'
    }
    assert.deepEqual(x, z)
  }

  if (typeof (describe) === 'function' && !bulk) {
    if (json5 !== false) {
      it('test_parse_json5: ' + JSON.stringify(arg), testJSON5)
    }
    if (json5 !== true) {
      it('test_parse_native: ' + JSON.stringify(arg), testNativeJSON)
      it('test_parse_strict: ' + JSON.stringify(arg), testStrictJSON)
    }
  } else {
    if (json5 !== false) {
      testJSON5()
    }
    if (json5 !== true) {
      testNativeJSON()
      testStrictJSON()
    }
  }
}

addTest('"\\uaaaa\\u0000\\uFFFF\\uFaAb"')
addTest(' "\\xaa\\x00\xFF\xFa\0\0"  ')
addTest('"\\\'\\"\\b\\f\\t\\n\\r\\v"')
addTest('"\\q\\w\\e\\r\\t\\y\\\\i\\o\\p\\[\\/\\\\"')
addTest('"\\\n\\\r\n\\\n"')
addTest('\'\\\n\\\r\n\\\n\'')
addTest('  null')
addTest('true  ')
addTest('false')
addTest(' Infinity ')
addTest('+Infinity')
addTest('[]')
addTest('[ 0xA2, 0X024324AaBf]')
addTest('-0x12')
addTest('  [1,2,3,4,5]')
addTest('[1,2,3,4,5,]  ')
addTest('[1e-13]')
addTest('[null, true, false]')
addTest('  [1,2,"3,4,",5,]')
addTest('[ 1,\n2,"3,4,"  \r\n,\n5,]')
addTest('[  1  ,  2  ,  3  ,  4  ,  5  ,  ]')
addTest('{}  ')
addTest('{"2":1,"3":null,}')
addTest('{ "2 " : 1 , "3":null  , }')
addTest('{ "2"  : 25e245 ,  "3": 23 }')
addTest('{"2":1,"3":nul,}')
addTest('{:1,"3":nul,}')
addTest('[1,2] // ssssssssss 3,4,5,]  ')
addTest('[1,2 , // ssssssssss \n//xxx\n3,4,5,]  ')
addTest('[1,2 /* ssssssssss 3,4,*/ /* */ , 5 ]  ')
addTest('[1,2 /* ssssssssss 3,4,*/ /* * , 5 ]  ')
addTest('{"3":1,"3":,}')
addTest('{ чйуач:1, щцкшчлм  : 4,}')
addTest('{ qef-:1 }')
addTest('{ $$$:1 , ___: 3}')
addTest('{3:1,2:1}')
addTest('{3.4e3:1}')
addTest('{-3e3:1}')
addTest('{+3e3:1}')
addTest('{.3e3:1}')

for (let i = 0; i < 200; i++) {
  addTest('"' + String.fromCharCode(i) + '"', true)
}

// strict JSON test cases
addTest('"\\xaa"')
addTest('"\\0"')
addTest('"\0"')
addTest('"\\v"')
addTest('{null: 123}')
addTest("{'null': 123}")

assert.throws(function () {
  parse('0o', { mode: 'json5' })
})

assert.strictEqual(parse('01234567', { mode: 'json5' }), 342391)
assert.strictEqual(parse('0o1234567', { mode: 'json5' }), 342391)

// undefined
// assert.strictEqual(parse(undefined, { mode: 'json5' }), undefined)
assert.throws(function () {
  parse(undefined, { mode: 'json5' })
})

// whitespaces
addTest('[1,\r\n2,\r3,\n]')
'\x09\x0A\x0B\x0C\x0D\x20\xA0\uFEFF\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000'.split('').forEach(function (x) {
  addTest(x + '[1,' + x + '2]' + x)
  // Do not test additional Unicode line separators, which are accepted
  // as a usual whitespace by JavaScript parser, but JJU rejects them
  // as line breaks, which must not appear inside a string value.
  const json5 = x === '\u2028' || x === '\u2029' ? false : undefined
  addTest('"' + x + '"' + x, undefined, json5)
})
'\u000A\u000D\u2028\u2029'.split('').forEach(function (x) {
  addTest(x + '[1,' + x + '2]' + x)
  addTest('"\\' + x + '"' + x)
})

assert.throws(parse.bind(null, '{-1:42}', { mode: 'json5' }))

assert.deepEqual(parse('{ "key": 1, "key": 2}'), { key: 2 })
assert.throws(function () {
  parse('{ "key": 1, "key": 2}', { allowDuplicateObjectKeys: false })
})

for (let i = 0; i < 100; ++i) {
  const str = '-01.e'.split('')

  const rnd = [1, 2, 3, 4, 5].map(function (x) {
    x = ~~(Math.random() * str.length)
    return str[x]
  }).join('')

  let x
  try {
    x = parse(rnd, { mode: 'json5' })
  } catch (err) {
    x = 'fail'
  }
  let y
  try {
    y = JSON.parse(rnd, { mode: 'json5' })
  } catch (err) {
    y = 'fail'
  }
  let z
  try {
    z = eval(rnd)
  } catch (err) {
    z = 'fail'
  }
  // console.log(rnd, x, y, z)
  if (x !== y && x !== z) {
    throw new Error('ERROR')
  }
}

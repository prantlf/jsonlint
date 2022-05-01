import { strict as assert } from 'assert'
import { parse } from '..'
import { compile } from '../lib/validator'
import { print } from '../lib/printer'

declare function it (description: string, test: Function): void

function addTest (description, test) {
  if (typeof it === 'function') {
    it(description, test)
  } else {
    exports['test type declarations of ' + description] = test
  }
}

addTest('parse', () => {
  const result = parse('{}')
  assert.equal(typeof result, 'object')
  parse('{}', () => undefined)
  parse('{}', {})
  parse('{}', { mode: 'json' })
  parse('{}', { mode: 'cjson' })
  parse('{}', { mode: 'json5' })
  parse('{}', {
    ignoreComments: true,
    ignoreTrailingCommas: true,
    allowSingleQuotedStrings: true,
    allowDuplicateObjectKeys: true,
    reviver: () => undefined
  })
  assert.ok(true)
})

addTest('compile', () => {
  const validate = compile('{}')
  assert.equal(typeof validate, 'function')
  compile('{}', 'json-schema-draft-04')
  compile('{}', 'json-schema-draft-06')
  compile('{}', 'json-schema-draft-07')
  compile('{}', {})
  compile('{}', { mode: 'json' })
  compile('{}', { mode: 'cjson' })
  compile('{}', { mode: 'json5' })
  compile('{}', { environment: 'json-schema-draft-04' })
  compile('{}', { environment: 'json-schema-draft-06' })
  compile('{}', { environment: 'json-schema-draft-07' })
  compile('{}', {
    ignoreComments: true,
    ignoreTrailingCommas: true,
    allowSingleQuotedStrings: true,
    allowDuplicateObjectKeys: true
  })
  assert.ok(true)
})

addTest('print', () => {
  const tokens = [
    { type: 'symbol', value: '{', raw: '{' },
    { type: 'symbol', value: '}', raw: '}' }
  ]
  const result = print(tokens)
  assert.equal(result, '{}')
  print(tokens, {})
  print(tokens, { indent: 2 })
  print(tokens, { indent: '  ' })
  print(tokens, { pruneComments: true })
  print(tokens, { stripObjectKeys: true })
  print(tokens, { enforceDoubleQuotes: true })
  print(tokens, { enforceSingleQuotes: true })
  print(tokens, { trimTrailingCommas: true })
  assert.ok(true)
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
if (require.main === module) { require('test').run(exports) }

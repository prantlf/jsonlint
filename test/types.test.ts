import tehanu from 'tehanu'
import { strict as assert } from 'assert'
import { parse } from '../lib/jsonlint'
import { compile } from '../lib/validator'
import { print } from '../lib/printer'

const test = tehanu(import.meta.url)

test('parse', () => {
  const result = parse('{}')
  assert.equal(typeof result, 'object')
  parse('{}', () => undefined)
  parse('{}', {})
  parse('{}', { mode: 'json' })
  parse('{}', { mode: 'cjson' })
  parse('{}', { mode: 'json5' })
  parse('{}', {
    ignoreBOM: true,
    ignoreComments: true,
    ignoreTrailingCommas: true,
    allowSingleQuotedStrings: true,
    allowDuplicateObjectKeys: true,
    reviver: () => undefined
  })
  assert.ok(true)
})

test('compile', () => {
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
    ignoreBOM: true,
    ignoreComments: true,
    ignoreTrailingCommas: true,
    allowSingleQuotedStrings: true,
    allowDuplicateObjectKeys: true
  })
  assert.ok(true)
})

test('print', () => {
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

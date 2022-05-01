const fs = require('fs')
const path = require('path')
const prefix = `(function (global, factory) {
  // eslint-disable-next-line no-unused-expressions, multiline-ternary
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports)
  // eslint-disable-next-line no-undef, multiline-ternary
    : typeof define === 'function' && define.amd ? define('jsonlintSchemaDrafts', ['exports'], factory)
    // eslint-disable-next-line no-undef
      : (global = global || self, factory(global.jsonlintSchemaDrafts = {}));
}(this, function (exports) { 'use strict';

`
const suffix = `
  Object.defineProperty(exports, '__esModule', { value: true });
}));
`
const environments = [
  'json-schema-draft-04',
  'json-schema-draft-06',
  'json-schema-draft-07'
]
const input = environments.map(function (environment) {
  const file = path.join(__dirname, '../node_modules/ajv/lib/refs/' + environment + '.json')
  const code = fs.readFileSync(file)
  return 'exports["' + environment + '"] = ' + code
})
const output = prefix + input.join('\n') + suffix
const file = path.join(__dirname, '../lib/schema-drafts.js')
fs.writeFileSync(file, output)

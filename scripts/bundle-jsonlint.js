const fs = require('fs')
const path = require('path')
const prefix = `(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('jsonlint', ['exports'], factory) :
  (global = global || self, factory(global.jsonlint = {}))
}(this, function (exports) { 'use strict'

`
const suffix = `
  exports.parse = parse
  exports.tokenize = tokenize
  exports.pathToPointer = pathToPointer
  exports.pointerToPath = pointerToPath

  exports.parseNative = parseNative
  exports.parseCustom = parseCustom
  exports.getErrorTexts = getTexts

  Object.defineProperty(exports, '__esModule', { value: true })
}));
`
const unicodeFile = path.join(__dirname, '../src/unicode.js')
const unicodeSource = fs.readFileSync(unicodeFile, 'utf8')
const customFile = path.join(__dirname, '../src/custom-parser.js')
const customSource = fs.readFileSync(customFile, 'utf8')
const pointerFile = path.join(__dirname, '../src/pointer.js')
const pointerSource = fs.readFileSync(pointerFile, 'utf8')
const nativeFile = path.join(__dirname, '../src/native-parser.js')
const nativeSource = fs.readFileSync(nativeFile, 'utf8')
const configurableFile = path.join(__dirname, '../src/configurable-parser.js')
const configurableSource = fs.readFileSync(configurableFile, 'utf8')
const jsonlintFile = path.join(__dirname, '../lib/jsonlint.js')
const jsonlintSource = prefix + unicodeSource + '\n' + customSource + '\n' +
  pointerSource + '\n' + nativeSource + '\n' + configurableSource + suffix
fs.writeFileSync(jsonlintFile, jsonlintSource)

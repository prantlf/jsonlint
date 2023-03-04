(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports)
    : typeof define === 'function' && define.amd ? define('jsonlint-formatter', ['exports'], factory)
      : (global = global || self, factory(global.jsonlintFormatter = {}))
}(this, function (exports) {
  'use strict'

  /**
   * Manual formatter taken straight from https://github.com/umbrae/jsonlintdotcom
   *
   * jsl.format - Provide json reformatting in a character-by-character approach,
   *   so that even invalid JSON may be reformatted (to the best of its ability).
   *
   */

  function repeat (s, count) {
    return new Array(count + 1).join(s)
  }

  function format (json, indent) {
    let i = 0
    let length = 0
    const indentString = indent !== undefined
      ? typeof indent === 'number'
        ? new Array(indent + 1).join(' ')
        : indent
      : '  '
    let outputString = ''
    let indentLevel = 0
    let inString
    let currentChar

    for (i = 0, length = json.length; i < length; i += 1) {
      currentChar = json.charAt(i)
      switch (currentChar) {
        case '{':
        case '[':
          if (!inString) {
            outputString += currentChar + '\n' + repeat(indentString, indentLevel + 1)
            indentLevel += 1
          } else {
            outputString += currentChar
          }
          break
        case '}':
        case ']':
          if (!inString) {
            indentLevel -= 1
            outputString += '\n' + repeat(indentString, indentLevel) + currentChar
          } else {
            outputString += currentChar
          }
          break
        case ',':
          if (!inString) {
            outputString += ',\n' + repeat(indentString, indentLevel)
          } else {
            outputString += currentChar
          }
          break
        case ':':
          if (!inString) {
            outputString += ': '
          } else {
            outputString += currentChar
          }
          break
        case ' ':
        case '\n':
        case '\t':
          if (inString) {
            outputString += currentChar
          }
          break
        case '"':
          if (i > 0 && json.charAt(i - 1) !== '\\') {
            inString = !inString
          }
          outputString += currentChar
          break
        default:
          outputString += currentChar
          break
      }
    }

    return outputString
  }

  exports.format = format

  Object.defineProperty(exports, '__esModule', { value: true })
}))

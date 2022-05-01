(function (global, factory) {
  // eslint-disable-next-line no-unused-expressions, multiline-ternary
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports)
  // eslint-disable-next-line no-undef, multiline-ternary
    : typeof define === 'function' && define.amd ? define('jsonlint-sorter', ['exports'], factory)
    // eslint-disable-next-line no-undef
      : (global = global || self, factory(global.jsonlintSorter = {}))
}(this, function (exports) {
  'use strict'

  // from http://stackoverflow.com/questions/1359761/sorting-a-json-object-in-javascript
  const hasOwnProperty = Object.prototype.hasOwnProperty
  function sortObject (o) {
    if (Array.isArray(o)) {
      return o.map(sortObject)
    } else if (Object.prototype.toString.call(o) !== '[object Object]') {
      return o
    }
    const sorted = {}
    let key
    const a = []
    for (key in o) {
      if (hasOwnProperty.call(o, key)) {
        a.push(key)
      }
    }
    a.sort()
    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = sortObject(o[a[key]])
    }
    return sorted
  }

  exports.sortObject = sortObject

  Object.defineProperty(exports, '__esModule', { value: true })
}))

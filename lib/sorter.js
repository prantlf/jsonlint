(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports)
    : typeof define === 'function' && define.amd ? define('jsonlint-sorter', ['exports'], factory)
      : (global = global || self, factory(global.jsonlintSorter = {}))
}(this, function (exports) {
  'use strict'

  // from http://stackoverflow.com/questions/1359761/sorting-a-json-object-in-javascript
  const ownsProperty = Object.prototype.hasOwnProperty
  function sortObject (o, { ignoreCase, locale, caseFirst, numeric } = {}) {
    if (Array.isArray(o)) {
      return o.map(sortObject)
    }if (Object.prototype.toString.call(o) !== '[object Object]') {
      return o
    }
    const sorted = {}
    let key
    const a = []
    for (key in o) {
      if (ownsProperty.call(o, key)) {
        a.push(key)
      }
    }
    if (locale || caseFirst || numeric) {
      if (locale === 'default') {
        locale = undefined
      }
      const sortOptions = { caseFirst, numeric }
      if (ignoreCase) {
        sortOptions.sensitivity = 'accent'
      }
      a.sort((l, r) => l.localeCompare(r, locale, sortOptions))
    } else if (ignoreCase) {
      a.sort((l, r) => {
        l = l.toLowerCase()
        r = r.toLowerCase()
        return l < r ? -1 : l > r ? 1 : 0
      })
    } else {
      a.sort()
    }
    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = sortObject(o[a[key]])
    }
    return sorted
  }

  exports.sortObject = sortObject

  Object.defineProperty(exports, '__esModule', { value: true })
}))

/* globals navigator, process, parseCustom, parseNative */

const isSafari = typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)
const oldNode = typeof process !== 'undefined' && process.version.startsWith('v4.')

function needsCustomParser (options) {
  return options.ignoreComments || options.ignoreTrailingCommas ||
  options.allowSingleQuotedStrings || options.allowDuplicateObjectKeys === false ||
  options.mode === 'cjson' || options.mode === 'json5' || isSafari || oldNode
}

function getReviver (options) {
  if (typeof options === 'function') {
    return options
  } else if (options) {
    return options.reviver
  }
}

function parse (input, options) { // eslint-disable-line no-unused-vars
  options || (options = {})
  return needsCustomParser(options)
    ? parseCustom(input, options)
    : parseNative(input, getReviver(options))
}

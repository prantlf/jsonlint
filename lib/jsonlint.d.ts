type ParseMode = 'json' | 'cjson' | 'json5'

interface ParseOptions {
  ignoreComments?: boolean
  ignoreTrailingCommas?: boolean
  allowSingleQuotedStrings?: boolean
  allowDuplicateObjectKeys?: boolean
  mode?: ParseMode
  reviver?: Function
}

/**
 * Parses a string formatted as JSON to a JSON output (primitive type, object
 * or array). It is compatible with the native `JSON.parse` method.
 *
 * @example
 * ```ts
 * import { parse } from '@prantlf/jsonlint'
 * const parsed = parse('string with JSON data')
 * ```
 *
 * @param input - a string input to parse
 * @param reviverOrOptions - either a value reviver or an object
 *                           with multiple options
 * @returns the parsed result - a primitive value, array or object
 */
declare function parse (input: string, reviverOrOptions?: Function | ParseOptions): object

interface TokenizeOptions {
  ignoreComments?: boolean
  ignoreTrailingCommas?: boolean
  allowSingleQuotedStrings?: boolean
  allowDuplicateObjectKeys?: boolean
  mode?: ParseMode
  reviver?: Function
  rawTokens?: boolean
  tokenLocations?: boolean
  tokenPaths?: boolean
}

/**
 * Parses a string formatted as JSON to an array of JSON tokens.
 *
 * @example
 * ```ts
 * import { tokenize } from '@prantlf/jsonlint'
 * const tokens = tokenize('string with JSON data')
 * ```
 *
 * @param input - a string input to parse
 * @param reviverOrOptions - either a value reviver or an object
 *                           with multiple options
 * @returns an array with the tokens
 */
declare function tokenize (input: string, reviverOrOptions?: Function | TokenizeOptions): object

export { parse, tokenize }

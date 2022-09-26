type ParseMode = 'json' | 'cjson' | 'json5'

interface ParseOptions {
  ignoreBOM?: boolean
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
  ignoreBOM?: boolean
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

declare module '@prantlf/jsonlint/lib/validator' {
  type Environment = 'json-schema-draft-04' | 'json-schema-draft-06' | 'json-schema-draft-07'

  interface CompileOptions {
    ignoreBOM?: boolean
    ignoreComments?: boolean
    ignoreTrailingCommas?: boolean
    allowSingleQuotedStrings?: boolean
    allowDuplicateObjectKeys?: boolean
    environment?: Environment
    mode?: ParseMode
  }

  /**
   * Generates a JSON Schema validator.
   *
   * @example
   * ```ts
   * import { compile } from '@prantlf/jsonlint/lib/validator'
   * const validate = compile('string with JSON schema')
   * const parsed = validate('string with JSON data')
   * ```
   *
   * @param schema - a string with the JSON Schema to validate with
   * @param environmentOrOptions - either a string with the version
   *                               of the JSON Schema standard or an object
   *                               with multiple options
   * @returns the validator function
   */
  function compile (schema: string, environmentOrOptions?: Environment | CompileOptions): Function
}

declare module '@prantlf/jsonlint/lib/printer' {
  interface PrintOptions {
    indent?: number | string
    pruneComments?: boolean
    stripObjectKeys?: boolean
    enforceDoubleQuotes?: boolean
    enforceSingleQuotes?: boolean
    trimTrailingCommas?: boolean
  }

  /**
   * Pretty-prints an array of JSON tokens parsed from a valid JSON string by `tokenize`.
   *
   * @example
   * ```ts
   * import { tokenize } from '@prantlf/jsonlint'
   * import { print } from '@prantlf/jsonlint/lib/printer'
   * const tokens = tokenize('string with JSON data', { rawTokens: true })
   * const outputString = print(tokens, { indent: 2 })
   * ```
   *
   * @param tokens - an array of JSON tokens
   * @param options - an object with multiple options
   * @returns the output string
   */
  function print (tokens: Array<object>, options?: PrintOptions): string
}

export { parse, tokenize }

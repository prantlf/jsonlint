declare module '@prantlf/jsonlint' {
  /**
   * JSON parsing modes, which are a shortcut for setting multiple parsing options.
   */
  type ParseMode = 'json' | 'cjson' | 'json5'

  /**
   * Can transform the value, which was parsed for a particular object key from the JSON input.
   *
   * See the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter).
   *
   * @param key - a property name
   * @param vaslue - a property value
   * @returns the value to be set in the parsed JSON object
   */
  type Reviver = (key: string, value: unknown) => unknown

  /**
   * Options to customize JSON input parsing.
   */
  interface ParseOptions {

    /**
     * Ignore the leading BOM in the JSON input, if it is detected.
     *
     * The default is `false`, which will cause the parser to fail, when a BOM is encountered.
     */

    ignoreBOM?: boolean

    /**
     * Ignore comments in the JSON input (CJSON, JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a comment is encountered.
     */
    ignoreComments?: boolean

    /**
     * Ignore trailing commas after the last item in objects and arrays in the JSON input (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a trailing comma is encountered.
     */
    ignoreTrailingCommas?: boolean

    /**
     * Allow quotes around strings to be single quotes (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a single quote around a string is encountered.
     */
    allowSingleQuotedStrings?: boolean

    /**
     * Allow or disallow duplicated keys in objects.
     *
     * The default is `true`, which will allow duplicate keys to occur and return only the last occurrence in the parsed output.
     */
    allowDuplicateObjectKeys?: boolean

    /**
     * Set the JSON parsing mode as a shortcut for setting multiple parsing options.
     *
     * Available values: `'json' | 'cjson' | 'json5'`
     */
    mode?: ParseMode

    /**
     * Transform the value, which was parsed for a particular object key from the JSON input.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter.
     */
    reviver?: Reviver
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
  function parse (input: string, reviverOrOptions?: Reviver | ParseOptions): Record<string, unknown>

  /**
   * Options to customize JSON input tokenization.
   */
  interface TokenizeOptions {

    /**
     * Ignore the leading BOM in the JSON input, if it is detected.
     *
     * The default is `false`, which will cause the parser to fail, when a BOM is encountered.
     */
    ignoreBOM?: boolean

    /**
     * Ignore comments in the JSON input (CJSON, JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a comment is encountered.
     */
    ignoreComments?: boolean

    /**
     * Ignore trailing commas after the last item in objects and arrays in the JSON input (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a trailing comma is encountered.
     */
    ignoreTrailingCommas?: boolean

    /**
     * Allow quotes around strings to be single quotes (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a single quote around a string is encountered.
     */
    allowSingleQuotedStrings?: boolean

    /**
     * Allow or disallow duplicated keys in objects.
     *
     * The default is `true`, which will allow duplicate keys to occur and return only the last occurrence in the parsed output.
     */
    allowDuplicateObjectKeys?: boolean

    /**
     * Set the JSON parsing mode as a shortcut for setting multiple parsing options.
     *
     * Available values: `'json' | 'cjson' | 'json5'`
     */
    mode?: ParseMode

    /**
     * Transform the value, which was parsed for a particular object key from the JSON input.
     *
     * See the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter).
     */
    reviver?: Reviver

    /**
     * Adds a `raw` property with the original string from the JSON input.
     */
    rawTokens?: boolean

    /**
     * Adds a `location` property with start, end and length of the original string from the JSON input.
     */
    tokenLocations?: boolean

    /**
     * Adds a `path` property with an array of keys and array indexes "on the way to" the token's value.
     */
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
  function tokenize (input: string, reviverOrOptions?: Reviver | TokenizeOptions): Record<string, unknown>
}

declare module '@prantlf/jsonlint/lib/jsonlint' {
  /**
   * JSON parsing modes, which are a shortcut for setting multiple parsing options.
   */
  type ParseMode = 'json' | 'cjson' | 'json5'

  /**
   * Can transform the value, which was parsed for a particular object key from the JSON input.
   *
   * See the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter).
   *
   * @param key - a property name
   * @param vaslue - a property value
   * @returns the value to be set in the parsed JSON object
   */
  type Reviver = (key: string, value: unknown) => unknown

  /**
   * Options to customize JSON input parsing.
   */
  interface ParseOptions {

    /**
     * Ignore the leading BOM in the JSON input, if it is detected.
     *
     * The default is `false`, which will cause the parser to fail, when a BOM is encountered.
     */

    ignoreBOM?: boolean

    /**
     * Ignore comments in the JSON input (CJSON, JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a comment is encountered.
     */
    ignoreComments?: boolean

    /**
     * Ignore trailing commas after the last item in objects and arrays in the JSON input (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a trailing comma is encountered.
     */
    ignoreTrailingCommas?: boolean

    /**
     * Allow quotes around strings to be single quotes (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a single quote around a string is encountered.
     */
    allowSingleQuotedStrings?: boolean

    /**
     * Allow or disallow duplicated keys in objects.
     *
     * The default is `true`, which will allow duplicate keys to occur and return only the last occurrence in the parsed output.
     */
    allowDuplicateObjectKeys?: boolean

    /**
     * Set the JSON parsing mode as a shortcut for setting multiple parsing options.
     *
     * Available values: `'json' | 'cjson' | 'json5'`
     */
    mode?: ParseMode

    /**
     * Transform the value, which was parsed for a particular object key from the JSON input.
     *
     * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter.
     */
    reviver?: Reviver
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
  function parse (input: string, reviverOrOptions?: Reviver | ParseOptions): Record<string, unknown>

  /**
   * Options to customize JSON input tokenization.
   */
  interface TokenizeOptions {

    /**
     * Ignore the leading BOM in the JSON input, if it is detected.
     *
     * The default is `false`, which will cause the parser to fail, when a BOM is encountered.
     */
    ignoreBOM?: boolean

    /**
     * Ignore comments in the JSON input (CJSON, JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a comment is encountered.
     */
    ignoreComments?: boolean

    /**
     * Ignore trailing commas after the last item in objects and arrays in the JSON input (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a trailing comma is encountered.
     */
    ignoreTrailingCommas?: boolean

    /**
     * Allow quotes around strings to be single quotes (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a single quote around a string is encountered.
     */
    allowSingleQuotedStrings?: boolean

    /**
     * Allow or disallow duplicated keys in objects.
     *
     * The default is `true`, which will allow duplicate keys to occur and return only the last occurrence in the parsed output.
     */
    allowDuplicateObjectKeys?: boolean

    /**
     * Set the JSON parsing mode as a shortcut for setting multiple parsing options.
     *
     * Available values: `'json' | 'cjson' | 'json5'`
     */
    mode?: ParseMode

    /**
     * Transform the value, which was parsed for a particular object key from the JSON input.
     *
     * See the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#the_reviver_parameter).
     */
    reviver?: Reviver

    /**
     * Adds a `raw` property with the original string from the JSON input.
     */
    rawTokens?: boolean

    /**
     * Adds a `location` property with start, end and length of the original string from the JSON input.
     */
    tokenLocations?: boolean

    /**
     * Adds a `path` property with an array of keys and array indexes "on the way to" the token's value.
     */
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
  function tokenize (input: string, reviverOrOptions?: Reviver | TokenizeOptions): Record<string, unknown>
}

declare module '@prantlf/jsonlint/lib/validator' {

  /**
   * JSON parsing modes, which are a shortcut for setting multiple parsing options.
   */
  type ParseMode = 'json' | 'cjson' | 'json5'

  /**
   * Identifiers of supported JSON Schema drafts and JSON Type Definition.
   */
  type Environment = 'json-schema-draft-04' | 'draft-04' |
    'json-schema-draft-06' | 'draft-06' | 'json-schema-draft-07' | 'draft-07' |
    'json-schema-draft-2019-09' | 'draft-2019-09' |
    'json-schema-draft-2020-12' | 'draft-2020-12' |
    'json-type-definition' | 'jtd' | 'rfc8927'

  /**
   * Options to customize a JSON Schema validator.
   */
  interface CompileOptions {

    /**
     * Ignore the leading BOM in the JSON input, if it is detected.
     *
     * The default is `false`, which will cause the parser to fail, when a BOM is encountered.
     */
    ignoreBOM?: boolean

    /**
     * Ignore comments in the JSON input (CJSON, JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a comment is encountered.
     */
    ignoreComments?: boolean

    /**
     * Ignore trailing commas after the last item in objects and arrays in the JSON input (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a trailing comma is encountered.
     */
    ignoreTrailingCommas?: boolean

    /**
     * Allow quotes around strings to be single quotes (JSON5).
     *
     * The default is `false`, which will cause the parser to fail, when a single quote around a string is encountered.
     */
    allowSingleQuotedStrings?: boolean

    /**
     * Allow or disallow duplicated keys in objects.
     *
     * The default is `true`, which will allow duplicate keys to occur and return only the last occurrence in the parsed output.
     */
    allowDuplicateObjectKeys?: boolean

    /**
     * Set the JSON parsing mode as a shortcut for setting multiple parsing options.
     *
     * Available values: `'json' | 'cjson' | 'json5'`
     */
    mode?: ParseMode

    /**
     * Choose the JSON Schema draft or JSON Type Definition.
     *
     * Available values: `'json-schema-draft-04' | 'draft-04' |
     *   'json-schema-draft-06' | 'draft-06' | 'json-schema-draft-07' | 'draft-07' |
     *   'json-schema-draft-2019-09' | 'draft-2019-09' |
     *   'json-schema-draft-2020-12' | 'draft-2020-12' |
     *   'json-type-definition' | 'jtd' | 'rfc8927'`
     */
    environment?: Environment
  }

  /**
   * validates JSON input.
   *
   * @example
   * ```ts
   * import { compile } from '@prantlf/jsonlint/lib/validator'
   * const validate = compile('string with JSON Schema')
   * const parsed = validate('string with JSON data')
   * ```
   *
   * @param input - a string with the JSON input or a JSON object
   * @returns the valid input as JSON object
   */
  type Validator = (input: string | Record<string, unknown>) => Record<string, unknown>

  /**
   * Generates a JSON Schema validator.
   *
   * @example
   * ```ts
   * import { compile } from '@prantlf/jsonlint/lib/validator'
   * const validate = compile('string with JSON Schema')
   * const parsed = validate('string with JSON data')
   * ```
   *
   * @param schema - a string with the JSON Schema to validate with
   * @param environmentOrOptions - either a string with the version
   *                               of the JSON Schema standard or an object
   *                               with multiple options
   * @returns the validator function
   */
  function compile (schema: string | string[] | Record<string, unknown> | Record<string, unknown>[],
    environmentOrOptions?: Environment | CompileOptions): Validator
}

declare module '@prantlf/jsonlint/lib/printer' {

  /**
   * Options to customize printing of JSON tokens to a string.
   */
  interface PrintOptions {

    /**
     * Number of spaces to indent objects and arrays with,
     * or a string with the specific whitespace.
     */
    indent?: number | string

    /**
     * Omit the comments from the output.
     */
    pruneComments?: boolean

    /**
     * Omit quotes around object keys.
     */
    stripObjectKeys?: boolean

    /**
     * Enforce all quotes around strings be double quotes.
     */
    enforceDoubleQuotes?: boolean

    /**
     * Enforce all quotes around strings be single quotes.
     */
    enforceSingleQuotes?: boolean

    /**
     * Remove trailing commas after the last item in objects and arrays.
     */
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
  function print (tokens: Array<Record<string, unknown>>, options?: PrintOptions): string
}

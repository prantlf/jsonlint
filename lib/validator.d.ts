declare module '@prantlf/jsonlint/lib/validator' {
  type ParseMode = 'json' | 'cjson' | 'json5'
  type Environment = 'json-schema-draft-04' | 'json-schema-draft-06' | 'json-schema-draft-07'

  interface CompileOptions {
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

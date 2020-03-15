
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
export function print (tokens: object[], options?: PrintOptions): string

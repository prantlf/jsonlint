# JSON Lint

[![Latest version](https://img.shields.io/npm/v/@prantlf/jsonlint)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/@prantlf/jsonlint)
](https://www.npmjs.com/package/@prantlf/jsonlint)
[![Code coverage](https://codecov.io/gh/prantlf/jsonlint/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/jsonlint)

A [JSON]/CJSON/[JSON5] parser, validator and pretty-printer with a command-line client. See it in action at https://prantlf.github.io/jsonlint/.

This is a fork of the original project ([zaach/jsonlint](https://github.com/zaach/jsonlint)) with the following enhancements:

* Handles multiple files on the command line (by Greg Inman).
* Walks directories recursively (by Paul Vollmer).
* Provides 100% compatible interface to the native `JSON.parse` method.
* Optionally ignores the leading UTF-8 byte-order mark (BOM).
* Optionally recognizes JavaScript-style comments (CJSON) and single quoted strings (JSON5).
* Optionally ignores trailing commas and reports duplicate object keys as an error.
* Optionally checks that also the expected format matches, including sorted object keys.
* Supports [JSON Schema] drafts 04, 06, 07, 2019-09 and 2020-12.
* Supports [JSON Type Definition].
* Offers pretty-printing including comment-stripping and object keys without quotes (JSON5).
* Prefers the native JSON parser if possible to run [10x faster than the custom parser].
* Reports errors with rich additional information. From the JSON Schema validation too.
* Consumes configuration from both command line and [configuration files](configuration).
* Implements JavaScript modules using [UMD] to work in Node.js, in a browser, everywhere.
* Depends on up-to-date npm modules with no installation warnings.
* Small size - 18.4 kB minified, 6.45 kB gzipped, 5.05 kB brotlied.

**Note:** In comparison with the original project, this package exports only the `parse` method; not the `Parser` object.

Integration to the favourite task loaders for JSON file validation is provided by the following NPM modules:

* [`Grunt`] - see [`@prantlf/grunt-jsonlint`]
* [`Gulp`] - see [`@prantlf/gulp-jsonlint`]
* [`Rollup`] - see [`rollup-plugin-jsonlint`]

## Synopsis

Check syntax of JSON files:

    jsonlint -q data/*.json

Parse a JSON string:

```js
const { parse } = require('@prantlf/jsonlint')
const data = parse('{"creative": false}')
```

Example of an error message:

    Parse error on line 1, column 14:
    {"creative": ?}
    -------------^
    Unexpected token "?"

## Command-line Interface

Install `jsonlint` with `npm`, `pnpm`  or `yarn` globally to be able to use the command-line interface in any directory:

    npm i -g @prantlf/jsonlint
    pnpm i -g @prantlf/jsonlint
    yarn add --global @prantlf/jsonlint

Validate a single file:

    jsonlint myfile.json

or pipe the JSON input into `stdin`:

    cat myfile.json | jsonlint

or process all `.json` files in a directory and rewriting them with the pretty-printed output:

    jsonlint --in-place --pretty-print mydir

By default, `jsonlint` will either report a syntax error with details or pretty-print the source if it is valid.

A more complex example: check all JSON files in a Node.js project, except for dependencies in `node_modules`, allow comments (CJSON) and trailing commas, forbid duplicated object keys, print processed files names on the console, print errors on a single line and if an error occurs, continue with other files:

    jsonlint --comments --trailing-commas --no-duplicate-keys \
      --log-files --compact --continue '**/*.json' '!**/node_modules'

The same parameters can be passed from a configuration file:

```json
{
  "comments": true,
  "trailing-commas": true,
  "duplicate-keys": false,
  "log-files": true,
  "compact": true,
  "continue": true,
  "patterns": ["**/*.json", "!**/node_modules"]
}
```

The input can be checked not only to be a valid JSON, but also to be formatted according to the coding standard. For example, check that there is a trailing li break in each JSON file, in addition to alphabetically sorted keys and no duplicate keys:

    $ jsonlint -ksDr *.json

    File: package.json
    Formatted output differs
    ===================================================================
    --- package.json.orig
    +++ package.json
    @@ -105,4 +105,4 @@
        "lint",
        "jsonlint"
      ]
    -}
    +}
    \ No newline at end of file

### Usage

Usage: `jsonlint [options] [--] [<file, directory, pattern> ...]`

#### Options

    -f, --config <file>          read options from a custom configuration file
    -F, --no-config              disable searching for configuration files
    -s, --sort-keys              sort object keys (not when prettifying)
    -E, --extensions <ext...>    file extensions to process for directory walk
                                 (default: json, JSON)
    -i, --in-place               overwrite the input files
    -j, --diff                   print difference instead of writing the output
    -k, --check                  check that the input is equal to the output
    -t, --indent <num|char>      number of spaces or specific characters to use
                                 for indentation or a string with whitespace
    -c, --compact                compact error display
    -M, --mode <mode>            set other parsing flags according to the format
                                 of the input data (default: json)
    -B, --bom                    ignore the leading UTF-8 byte-order mark
    -C, --comments               recognize and ignore JavaScript-style comments
    -S, --single-quoted-strings  support single quotes as string delimiters
    -T, --trailing-commas        ignore trailing commas in objects and arrays
    -D, --no-duplicate-keys      report duplicate object keys as an error
    -V, --validate <file...>     JSON Schema file(s) to use for validation
    -e, --environment <env>      which version of JSON Schema the validation
                                 should use
    -x, --context <num>          line number used as the diff context
                                 (default: 3)
    -l, --log-files              print only the parsed file names to stdout
    -q, --quiet                  do not print the parsed json to stdout
    -n, --continue               continue with other files if an error occurs
    -p, --pretty-print           prettify the input instead of stringifying
                                 the parsed object
    -P, --pretty-print-invalid   force pretty-printing even for invalid input
    -r, --trailing-newline       ensure a line break at the end of the output
    -R, --no-trailing-newline    ensure no line break at the end of the output
    --prune-comments             omit comments from the prettified output
    --strip-object-keys          strip quotes from object keys if possible
    --enforce-double-quotes      surrounds all strings with double quotes
    --enforce-single-quotes      surrounds all strings with single quotes
    --trim-trailing-commas       omit trailing commas from objects and arrays
    -v, --version                output the version number
    -h, --help                   display help for command

You can use BASH patterns for including and excluding files (only files).
Patterns are case-sensitive and have to use slashes as directory separators.
A pattern to exclude from processing starts with "!".

Parsing mode can be "cjson" or "json5" to enable other flags automatically.
If no files or directories are specified, stdin will be parsed. Environments
for JSON Schema validation are "draft-04", "draft-06", "draft-07",
"draft-2019-09" or "draft-2020-12". The environment may be prefixed
with "json-schema-". JSON Type Definition can be selected by "rfc8927",
"json-type-definition" or "jtd". If not specified, it will be "draft-07".

If you specify schemas using the "-V" parameter, you will have to separate
files to test with "--".

### Configuration

In addition to the command line parameters, the options can be supplied from the following files:

    package.json, key jsonlint
    .jsonlintrc
    .jsonlintrc.json
    .jsonlintrc.yaml
    .jsonlintrc.yml
    .jsonlintrc.js
    .jsonlintrc.cjs
    jsonlint.config.js
    jsonlint.config.cjs

The automatic search for one of the following locations above can be disabled by the command-line parameter `-F|--no-config`. A concrete configuration file can be specified by the command-line parameter `-f|--config [file]`. Parameters from the command line will have higher priority than parameters from a configuration file.

The configuration is an object with the following properties, described above, which can be entered either in the kebab-case or in the camel-case:

| Parameter | Alias |
| --------- | ----- |
| patterns | |
| sort-keys | sortKeys |
| extensions | |
| in-place | inPlace |
| diff | |
| check | |
| indent | |
| compact | |
| mode | |
| bom | |
| comments | |
| single-quoted-strings | singleQuotedStrings |
| trailing-commas | trailingCommas |
| duplicate-keys | duplicateKeys |
| validate | |
| environment | |
| log-files | logFiles |
| quiet | |
| continue | |
| pretty-print | prettyPrint |
| pretty-print-invalid | prettyPrintInvalid |
| trailing-newline | trailingNewline'
| prune-comments | pruneComments |
| strip-object-keys | stripObjectKeys |
| enforce-double-quotes | enforceDoubleQuotes |
| enforce-single-quotes | enforceSingleQuotes |
| trim-trailing-commas | trimTrailingCommas |

The parameter `config` will be ignored in configuration files. The extra parameter `patterns` can be set to an array of strings with paths or patterns instead of putting them to the command line.

## Module Interface

Install `jsonlint` with `npm` locally to be able to use the module programmatically:

    npm i @prantlf/jsonlint -S

The only exported item is the `parse` method, which parses a string in the JSON format to a JavaScript object, array, or value:

```js
const { parse } = require('@prantlf/jsonlint')
// Fails at the position of the character "?".
const data2 = parse('{"creative": ?}') // throws an error
// Succeeds returning the parsed JSON object.
const data3 = parse('{"creative": false}')
// Recognizes comments and single-quoted strings.
const data3 = parse("{'creative': true /* for creativity */}", {
  ignoreComments: true,
  allowSingleQuotedStrings: true
})
```

Have a look at the [source] of the [on-line page] to see how to use `jsonlint` on web page.

The exported `parse` method is compatible with the native `JSON.parse` method. The second parameter provides the additional functionality:

    parse(input, [reviver|options])

| Parameter  | Description                                 |
| ---------- | ------------------------------------------- |
| `input`    | text in the JSON format (string)            |
| `reviver`  | converts object and array values (function) |
| `options`  | customize parsing options (object)          |

The `parse` method offers more detailed [error information](#error-handling), than the native `JSON.parse` method and it supports additional parsing options:

| Option                     | Description                                 |
| -------------------------- | ------------------------------------------- |
| `ignoreBOM`                | ignores the leading UTF-8 byte-order mark (boolean) |
| `ignoreComments`           | ignores single-line and multi-line JavaScript-style comments during parsing as another "whitespace" (boolean) |
| `ignoreTrailingCommas`     | ignores trailing commas in objects and arrays (boolean)      |
| `allowSingleQuotedStrings` | accepts strings delimited by single-quotes too (boolean)     |
| `allowDuplicateObjectKeys` | allows reporting duplicate object keys as an error (boolean) |
| `mode`                     | sets multiple options according to the type of input data (string) |
| `reviver`                  | converts object and array values (function) |

The `mode` parameter (string) sets parsing options to match a common format of input data:

| Mode    | Description                                               |
| ------- | --------------------------------------------------------- |
| `json`  | complies to the pure standard [JSON] (default if not set) |
| `cjson` | JSON with comments (sets `ignoreComments`)                |
| `json5` | complies to [JSON5]  (sets `ignoreComments`, `allowSingleQuotedStrings`, `ignoreTrailingCommas` and enables other JSON5 features) |

### Schema Validation

You can validate the input against a JSON Schema using the `lib/validator` module. The `compile` method accepts either an earlier parsed JSON Schema or a string with it:

```js
const { compile } = require('@prantlf/jsonlint/lib/validator')
const validate = compile('string with JSON Schema')
// Throws an error in case of failure.
const parsed = validate('string with JSON data')
```

If a string is passed to the `compile` method, the same options as for parsing JSON data can be passed as the second parameter. Compiling JSON Schema supports the same options as parsing JSON data too (except for `reviver`). They can be passed as the second (object) parameter. The optional second `environment` parameter (the default value is `draft-07`) ) can be passed either as a string or as an additional property in the options object too:

```js
const validate = compile('string with JSON Schema', { environment: 'draft-2020-12' })
```

If you use external definitions in multiple schemas, you have to pass an array of all schemas to `compile`. The `$id` properties have to be set in each sub-schema according to the `$ref` references in the main schema. The main schema is usually sent as the first one to be compiled immediately, so that the errors in any sub-schema would be reported right away:

```js
const validate = compile(['string with main schema', 'string with a sub-schema'])
```

### Pretty-Printing

You can parse a JSON string to an array of tokens and print it back to a string with some changes applied. It can be unification of whitespace, reformatting or stripping comments, for example. (Raw token values must be enabled when tokenizing the JSON input.)

```js
const { tokenize } = require('@prantlf/jsonlint')
const tokens = tokenize('string with JSON data', { rawTokens: true })
const { print } = require('@prantlf/jsonlint/lib/printer')
const output = print(tokens, { indent: 2 })
```

The [`tokenize`](#tokenizing) method accepts options in the second optional parameter. See the [`tokenize`](#tokenizing) method above for more information.

The [`print`](#pretty-printing) method accepts an object `options` as the second optional parameter. The following properties will be recognized there:

| Option                      | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `indent`                    | count of spaces or the specific characters to be used as an indentation unit |
| `pruneComments`             | will omit all tokens with comments                      |
| `stripObjectKeys`           | will not print quotes around object keys which are JavaScript identifier names |
| `enforceDoubleQuotes`       | will surround all strings with double quotes            |
| `enforceSingleQuotes`       | will surround all strings with single quotes            |
| `trimTrailingCommas`        | will omit all trailing commas after the last object entry or array item |

```js
// Just concatenate the tokens to produce the same output as was the input.
print(tokens)
// Strip all whitespace. (Just like `JSON.stringify(json)` would do it,
// but leaving comments in the output.)
print(tokens, {})
// Print to multiple lines without object and array indentation.
// (Just introduce line breaks.)
print(tokens, { indent: '' })
// Print to multiple lines with object and array indentation. (Just like
//`JSON.stringify(json, undefined, 2)` would do it, but retaining comments.)
print(tokens, { indent: 2 })
// Print to multiple lines with object and array indentation, omit comments.
// (Just like `JSON.stringify(json, undefined, '  ')` would do it.)
print(tokens, { indent: '  ', pruneComments: true })
// Print to multiple lines with indentation enabled and JSON5 object keys.
print(tokens, { indent: '\t', stripObjectKeys: true })
// Print to multiple lines with indentation enabled, unify JSON5 formatting.
print(tokens, {
  indent: '    ',
  enforceDoubleQuotes: true,
  trimTrailingCommas: true
})
```

### Tokenizing

The method `tokenize` has the same prototype as the method [`parse`](#module-interface), but returns an array of tokens instead of the JSON object.

```js
const { tokenize } = require('@prantlf/jsonlint')
const tokens = tokenize('{"flag":true /* default */}', {
  ignoreComments: true,
  rawTokens: true
}))
// Returns the following array:
// [
//   { type: 'symbol',     raw: '{',      value: '{' },
//   { type: 'literal',    raw: '"flag"', value: 'flag' },
//   { type: 'symbol',     raw: ':',      value: ':' },
//   { type: 'literal',    raw: 'true',   value: true },
//   { type: 'whitespace', raw: ' ' },
//   { type: 'comment',    raw: '/* default */' },
//   { type: 'symbol',     raw: '}',      value: '}' }
// ]
```

The `tokenize` method accepts options in the second optional parameter. See the [`parse`](#module-interface) method above for the shared options. There are several additional options supported for the tokenization:

| Option           | Description                                                        |
| -----------------| ------------------------------------------------------------------ |
| `rawTokens`      | adds a `raw` property with the original string from the JSON input |
| `tokenLocations` | adds a `location` property with start, end and length of the original string from the JSON input |
| `tokenPaths`     | adds a `path` property with an array of keys and array indexes "on the way to" the token's value |

If you want to retain comments or whitespace for pretty-printing, for example, set `rawTokens` to true. (The [`print`](#pretty-printing) method requires tokens produced with this flag enabled.)

### Performance

This is a part of an output from the [parser benchmark], when parsing a 4.68 KB formatted string ([package.json](./package.json)) with Node.js 18.14.2:

    the standard jsonlint parser x 78,998 ops/sec ±0.48% (95 runs sampled)
    the extended jsonlint parser x 7,923 ops/sec ±0.51% (93 runs sampled)
    the tokenising jsonlint parser x 6,281 ops/sec ±0.71% (91 runs sampled)

A custom JSON parser is [a lot slower] than the built-in one. However, it is more important to have a [clear error reporting] than the highest speed in scenarios like parsing configuration files. (For better error-reporting, the speed can be preserved by using the native parser initially and re-parsing with another parser only in case of failure.) Features like comments or JSON5 are also helpful in configuration files. Tokens preserve the complete input and can be used for pretty-printing without losing the comments.

### Error Handling

If parsing fails, a `SyntaxError` will be thrown with the following properties:

| Property   | Description                               |
| ---------- | ----------------------------------------- |
| `message`  | the full multi-line error message         |
| `reason`   | one-line explanation of the error         |
| `excerpt`  | part of the input string around the error |
| `pointer`  | "--^" pointing to the error in `excerpt`  |
| `location` | object pointing to the error location     |

The `location` object contains properties `line`, `column` and `offset`.

The following code logs twice the following message:

    Parse error on line 1, column 14:
    {"creative": ?}
    -------------^
    Unexpected token "?"

```js
const { parse } = require('@prantlf/jsonlint')
try {
  parse('{"creative": ?}')
} catch (error) {
  const { message, reason, excerpt, pointer, location } = error
  const { column, line, offset } = location.start
  // Logs the complete error message:
  console.log(message)
  // Logs the same text as included in the `message` property:
  console.log(`Parse error on line ${line}, ${column} column:
${excerpt}
${pointer}
${reason}`)
}
```

## License

Copyright (C) 2012-2023 Zachary Carter, Ferdinand Prantl

Licensed under the [MIT License].

[MIT License]: http://en.wikipedia.org/wiki/MIT_License
[pure JavaScript version]: http://prantlf.github.com/jsonlint/
[JSON]: https://tools.ietf.org/html/rfc8259
[JSON5]: https://spec.json5.org
[JSON Schema]: https://json-schema.org
[JSON Type Definition]: https://jsontypedef.com/
[UMD]: https://github.com/umdjs/umd
[`Grunt`]: https://gruntjs.com/
[`Gulp`]: http://gulpjs.com/
[`Rollup`]: https://rollupjs.org/
[`@prantlf/grunt-jsonlint`]: https://www.npmjs.com/package/@prantlf/grunt-jsonlint
[`@prantlf/gulp-jsonlint`]: https://www.npmjs.com/package/@prantlf/gulp-jsonlint
[`rollup-plugin-jsonlint`]: https://www.npmjs.com/package/rollup-plugin-jsonlint
[7x faster than the custom parser]: ./benchmarks/results/performance.md#results
[parser benchmark]: ./benchmarks#json-parser-comparison
[a lot slower]: ./benchmarks/results/performance.md#results
[clear error reporting]: ./benchmarks/results/errorReportingQuality.md#results
[on-line page]: http://prantlf.github.com/jsonlint/
[source]: ./web/jsonlint.html

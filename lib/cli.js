#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const parser = require('./jsonlint')
const formatter = require('./formatter')
const printer = require('./printer')
const sorter = require('./sorter')
const validator = require('./validator')
const pkg = require('../package')

function collectExtensions (extension) {
  return extension.split(',')
}

const commander = require('commander')
  .name('jsonlint')
  .usage('[options] [<file or directory> ...]')
  .description(pkg.description)
  .option('-s, --sort-keys', 'sort object keys (not when prettifying)')
  .option('-E, --extensions [ext]', 'file extensions to process for directory walk', collectExtensions, ['json', 'JSON'])
  .option('-i, --in-place', 'overwrite the input files')
  .option('-t, --indent [num|char]', 'number of spaces or specific characters to use for indentation', 2)
  .option('-c, --compact', 'compact error display')
  .option('-M, --mode [mode]', 'set other parsing flags according to a format type', 'json')
  .option('-C, --comments', 'recognize and ignore JavaScript-style comments')
  .option('-S, --single-quoted-strings', 'support single quotes as string delimiters')
  .option('-T, --trailing-commas', 'ignore trailing commas in objects and arrays')
  .option('-D, --no-duplicate-keys', 'report duplicate object keys as an error')
  .option('-V, --validate [file]', 'JSON schema file to use for validation')
  .option('-e, --environment [env]', 'which specification of JSON Schema the validation file uses')
  .option('-q, --quiet', 'do not print the parsed json to stdin')
  .option('-p, --pretty-print', 'prettify the input instead of stringifying the parsed object')
  .option('-P, --pretty-print-invalid', 'force pretty-printing even for invalid input')
  .option('-r, --trailing-newline', 'ensure a line break at the end of the output')
  .option('-R, --no-trailing-newline', 'ensure no line break at the end of the output')
  .option('--prune-comments', 'omit comments from the prettified output')
  .option('--strip-object-keys', 'strip quotes from object keys if possible (JSON5)')
  .option('--enforce-double-quotes', 'surrounds all strings with double quotes')
  .option('--enforce-single-quotes', 'surrounds all strings with single quotes (JSON5)')
  .option('--trim-trailing-commas', 'omit trailing commas from objects and arrays (JSON5)')
  .version(pkg.version, '-v, --version')
  .on('--help', () => {
    console.log()
    console.log('Parsing mode can be "cjson" or "json5" to enable other flags automatically.')
    console.log('If no files or directories are specified, stdin will be parsed. Environments')
    console.log('for JSON schema validation are "json-schema-draft-04", "json-schema-draft-06"')
    console.log('or "json-schema-draft-07". If not specified, it will be auto-detected.')
  })
  .parse(process.argv)

const options = commander.opts()

function logNormalError (error, file) {
  console.log('File:', file)
  console.error(error.message)
}

function logCompactError (error, file) {
  console.error(file + ': line ' + error.location.start.line +
    ', col ' + error.location.start.column + ', ' + error.reason + '.')
}

function parse (source, file) {
  let parserOptions, parsed, formatted
  try {
    parserOptions = {
      mode: options.mode,
      ignoreComments: options.comments,
      ignoreTrailingCommas: options.trailingCommas,
      allowSingleQuotedStrings: options.singleQuotedStrings,
      allowDuplicateObjectKeys: options.duplicateKeys
    }
    if (options.validate) {
      let validate
      try {
        const schema = fs.readFileSync(path.normalize(options.validate), 'utf8')
        parserOptions.environment = options.environment
        validate = validator.compile(schema, parserOptions)
      } catch (error) {
        const message = 'Loading the JSON schema failed: "' +
          options.validate + '".\n' + error.message
        throw new Error(message)
      }
      parsed = validate(source, parserOptions)
    } else {
      parsed = parser.parse(source, parserOptions)
    }
    if (options.prettyPrint) {
      parserOptions.rawTokens = true
      const tokens = parser.tokenize(source, parserOptions)
      // TODO: Support sorting tor the tokenized input too.
      return printer.print(tokens, {
        indent: options.indent,
        pruneComments: options.pruneComments,
        stripObjectKeys: options.stripObjectKeys,
        enforceDoubleQuotes: options.enforceDoubleQuotes,
        enforceSingleQuotes: options.enforceSingleQuotes,
        trimTrailingCommas: options.trimTrailingCommas
      })
    }
    if (options.sortKeys) {
      parsed = sorter.sortObject(parsed)
    }
    return JSON.stringify(parsed, null, options.indent)
  } catch (e) {
    if (options.prettyPrintInvalid) {
      /* From https://github.com/umbrae/jsonlintdotcom:
       * If we failed to validate, run our manual formatter and then re-validate so that we
       * can get a better line number. On a successful validate, we don't want to run our
       * manual formatter because the automatic one is faster and probably more reliable.
       */
      try {
        formatted = formatter.format(source, options.indent)
        // Re-parse so exception output gets better line numbers
        parsed = parser.parse(formatted)
      } catch (e) {
        if (options.compact) {
          logCompactError(e, file)
        } else {
          logNormalError(e, file)
        }
        // force the pretty print before exiting
        console.log(formatted)
      }
    } else {
      if (options.compact) {
        logCompactError(e, file)
      } else {
        logNormalError(e, file)
      }
    }
    process.exit(1)
  }
}

function processFile (file) {
  file = path.normalize(file)
  const original = fs.readFileSync(file, 'utf8')
  let source = parse(original, file)
  if (options.inPlace) {
    const lines = original.split(/\?r\n/)
    const newLine = !lines[lines.length - 1]
    if (options.trailingNewline === true ||
        (options.trailingNewline !== false && newLine)) {
      source += '\n'
    }
    fs.writeFileSync(file, source)
  } else {
    if (!options.quiet) {
      console.log(source)
    }
  }
}

function processSources (src, checkExtension) {
  const extensions = options.extensions.map(function (extension) {
    return '.' + extension
  })
  let srcStat
  try {
    srcStat = fs.statSync(src)
    if (srcStat.isFile()) {
      if (checkExtension) {
        const ext = path.extname(src)
        if (extensions.indexOf(ext) < 0) {
          return
        }
      }
      processFile(src)
    } else if (srcStat.isDirectory()) {
      const sources = fs.readdirSync(src)
      for (let i = 0; i < sources.length; i++) {
        processSources(path.join(src, sources[i]), true)
      }
    }
  } catch (err) {
    console.log('WARN', err.message)
  }
}

function main () {
  const files = commander.args
  let source = ''
  if (files.length) {
    for (let i = 0; i < files.length; i++) {
      processSources(files[i], false)
    }
  } else {
    const stdin = process.openStdin()
    stdin.setEncoding('utf8')
    stdin.on('data', function (chunk) {
      source += chunk.toString('utf8')
    })
    stdin.on('end', function () {
      const parsed = parse(source, '<stdin>')
      if (!options.quiet) {
        console.log(parsed)
      }
    })
  }
}

main()

#!/usr/bin/env node

const { readdirSync, readFileSync, statSync, writeFileSync } = require('fs')
const { extname, join, normalize } = require('path')
const { isDynamicPattern, sync } = require('fast-glob')
const { parse, tokenize } = require('./jsonlint')
const { format } = require('./formatter')
const { print } = require('./printer')
const { sortObject } = require('./sorter')
const { compile } = require('./validator')
const { description, version } = require('../package')

const collectValues = extension => extension.split(',')

const commander = require('commander')
  .name('jsonlint')
  .usage('[options] [<file, directory, pattern> ...]')
  .description(description)
  .option('-f, --config [file]', 'read options from a custom configuration file')
  .option('-F, --no-config', 'disable searching for configuration files')
  .option('-s, --sort-keys', 'sort object keys (not when prettifying)')
  .option('-E, --extensions [ext]', 'file extensions to process for directory walk', collectValues, ['json', 'JSON'])
  .option('-i, --in-place', 'overwrite the input files')
  .option('-j, --diff', 'print difference instead of writing the output')
  .option('-k, --check', 'check that the input is equal to the output')
  .option('-t, --indent [num|char]', 'number of spaces or specific characters to use for indentation', 2)
  .option('-c, --compact', 'compact error display')
  .option('-M, --mode [mode]', 'set other parsing flags according to a format type', 'json')
  .option('-C, --comments', 'recognize and ignore JavaScript-style comments')
  .option('-S, --single-quoted-strings', 'support single quotes as string delimiters')
  .option('-T, --trailing-commas', 'ignore trailing commas in objects and arrays')
  .option('-D, --no-duplicate-keys', 'report duplicate object keys as an error')
  .option('-V, --validate [file]', 'JSON schema file to use for validation')
  .option('-e, --environment [env]', 'which specification of JSON Schema the validation file uses')
  .option('-l, --log-files', 'print only the parsed file names to stdout')
  .option('-q, --quiet', 'do not print the parsed json to stdout')
  .option('-n, --continue', 'continue with other files if an error occurs')
  .option('-p, --pretty-print', 'prettify the input instead of stringifying the parsed object')
  .option('-P, --pretty-print-invalid', 'force pretty-printing even for invalid input')
  .option('-r, --trailing-newline', 'ensure a line break at the end of the output')
  .option('-R, --no-trailing-newline', 'ensure no line break at the end of the output')
  .option('--prune-comments', 'omit comments from the prettified output')
  .option('--strip-object-keys', 'strip quotes from object keys if possible (JSON5)')
  .option('--enforce-double-quotes', 'surrounds all strings with double quotes')
  .option('--enforce-single-quotes', 'surrounds all strings with single quotes (JSON5)')
  .option('--trim-trailing-commas', 'omit trailing commas from objects and arrays (JSON5)')
  .version(version, '-v, --version')
  .on('--help', () => {
    console.log()
    console.log('You can use BASH patterns for including and excluding files (only files).')
    console.log('Patterns are case-sensitive and have to use slashes as a path separators.')
    console.log('A pattern to exclude from processing starts with "!".')
    console.log()
    console.log('Parsing mode can be "cjson" or "json5" to enable other flags automatically.')
    console.log('If no files or directories are specified, stdin will be parsed. Environments')
    console.log('for JSON schema validation are "json-schema-draft-04", "json-schema-draft-06"')
    console.log('or "json-schema-draft-07". If not specified, it will be auto-detected.')
  })
  .parse(process.argv)

const paramNames = {
  'trailing-commas': 'trailingCommas',
  'single-quoted-strings': 'singleQuotedStrings',
  'duplicate-keys': 'duplicateKeys',
  'pretty-print': 'prettyPrint',
  'prune-comments': 'pruneComments',
  'strip-object-keys': 'stripObjectKeys',
  'enforce-double-quotes': 'enforceDoubleQuotes',
  'enforce-single-quotes': 'enforceSingleQuotes',
  'trim-trailing-commas': 'trimTrailingCommas',
  'sort-keys': 'sortKeys',
  'pretty-print-invalid': 'prettyPrintInvalid',
  'log-files': 'logFiles',
  'in-place': 'inPlace',
  'trailing-newline': 'trailingNewline'
}

const params = commander.opts()
let options
if (params.config === false) {
  options = params
} else {
  const { cosmiconfigSync } = require('cosmiconfig')
  const configurator = cosmiconfigSync('jsonlint')
  const { config = {} } = (params.config && configurator.load(params.config)) ||
    configurator.search() || {}
  options = mergeOptions({}, convertConfig(config), params)
}

const extensions = options.extensions.map(extension => '.' + extension)
let reported

function convertConfig (config) {
  const result = {}
  for (const key in config) {
    const name = paramNames[key] || key
    result[name] = config[key]
  }
  return result
}

function mergeOptions (target, ...sources) {
  for (const source of sources) {
    for (const key in source) {
      if (target[key] == null) {
        target[key] = source[key]
      }
    }
  }
  return target
}

function separateBlocks() {
  if (reported) {
    console.log()
  } else {
    reported = true
  }
}

function logNormalError (error, file) {
  separateBlocks()
  console.info('File:', file)
  console.error(error.message)
}

function logCompactError (error, file) {
  console.error(file + ': line ' + error.location.start.line +
    ', col ' + error.location.start.column + ', ' + error.reason + '.')
}

function processContents (source, file) {
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
        const schema = readFileSync(normalize(options.validate), 'utf8')
        parserOptions.environment = options.environment
        validate = compile(schema, parserOptions)
      } catch (error) {
        const message = 'Loading the JSON schema failed: "' +
          options.validate + '".\n' + error.message
        throw new Error(message)
      }
      parsed = validate(source, parserOptions)
    } else {
      parsed = parse(source, parserOptions)
    }
    if (options.prettyPrint) {
      parserOptions.rawTokens = true
      const tokens = tokenize(source, parserOptions)
      // TODO: Support sorting tor the tokenized input too.
      return print(tokens, {
        indent: options.indent,
        pruneComments: options.pruneComments,
        stripObjectKeys: options.stripObjectKeys,
        enforceDoubleQuotes: options.enforceDoubleQuotes,
        enforceSingleQuotes: options.enforceSingleQuotes,
        trimTrailingCommas: options.trimTrailingCommas
      })
    }
    if (options.sortKeys) {
      parsed = sortObject(parsed)
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
        formatted = format(source, options.indent)
        // Re-parse so exception output gets better line numbers
        parsed = parse(formatted)
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
    if (options.continue) {
      process.exitCode = 1
    } else {
      process.exit(1)
    }
  }
}

function ensureLineBreak (parsed, source) {
  const lines = source.split(/\r?\n/)
  const newLine = !lines[lines.length - 1]
  if (options.trailingNewline === true ||
      (options.trailingNewline !== false && newLine)) {
    parsed += '\n'
  }
  return parsed
}

function checkContents (file, source, parsed) {
  const { createTwoFilesPatch, structuredPatch } = require('diff')
  const structured = structuredPatch(`${file}.orig`, file, source, parsed, '', '', { context: 3 })
  const length = structured.hunks && structured.hunks.length
  const diff = createTwoFilesPatch(`${file}.orig`, file, source, parsed, '', '', { context: 3 })
  if (length > 0) {
    const hunk = length === 1 ? 'hunk differs' : 'hunks differ'
    const message = `${length} ${hunk}`
    if (options.compact) {
      console.error(`${file}: ${message}`)
    } else {
      separateBlocks()
      console.info('File:', file)
      console.error(message)
    }
    if (!options.quiet) {
      console.log(diff)
    }
    if (options.continue) {
      process.exitCode = 1
    } else {
      process.exit(1)
    }
  } else {
    if (options.compact) {
      console.info(`${file}: no difference`)
    } else if (options.logFiles) {
      console.info(file)
    }
  }
}

function diffContents(file, source, parsed) {
  const { createTwoFilesPatch, structuredPatch } = require('diff')
  const compact = options.quiet || options.compact
  let diff, length
  if (compact) {
    diff = structuredPatch(`${file}.orig`, file, source, parsed, '', '', { context: 3 })
    length = diff.hunks && diff.hunks.length
  } else {
    diff = createTwoFilesPatch(`${file}.orig`, file, source, parsed, '', '', { context: 3 })
    length = diff.split(/\r?\n/).length - 4
  }
  if (length > 0) {
    if (compact) {
      const hunk = length === 1 ? 'hunk differs' : 'hunks differ'
      console.info(`${file}: ${length} ${hunk}`)
    } else {
      separateBlocks()
      console.info('File:', file)
      console.log(diff)
    }
  } else {
    if (options.compact) {
      console.info(`${file}: no difference`)
    } else if (options.logFiles) {
      console.info(file)
    }
  }
}

function processFile (file) {
  file = normalize(file)
  if (options.logFiles && !(options.compact || options.check || options.diff)) {
    console.info(file)
  }
  const source = readFileSync(file, 'utf8')
  const parsed = processContents(source, file)
  if (options.inPlace) {
    if (options.logFiles && options.compact) {
      console.info(file)
    }
    writeFileSync(file, ensureLineBreak(parsed, source))
  } else if (options.check) {
    checkContents(file, source, ensureLineBreak(parsed, source))
  } else if (options.diff) {
    diffContents(file, source, ensureLineBreak(parsed, source))
  } else {
    if (!(options.quiet || options.logFiles)) {
      console.log(parsed)
    }
  }
}

function processSource (src, checkExtension) {
  try {
    const srcStat = statSync(src)
    if (srcStat.isFile()) {
      if (checkExtension) {
        const ext = extname(src)
        if (extensions.indexOf(ext) < 0) {
          return
        }
      }
      processFile(src)
    } else if (srcStat.isDirectory()) {
      const sources = readdirSync(src)
      for (const source of sources) {
        processSource(join(src, source), true)
      }
    }
  } catch ({ message }) {
    console.warn('WARN', message)
  }
}

function processPatterns (patterns) {
  const files = sync(patterns, { onlyFiles: true })
  if (!files.length) {
    console.error('no files found')
    process.exit(1)
  }
  for (const file of files) {
    try {
      processFile(file)
    } catch ({ message }) {
      console.warn('WARN', message)
    }
  }
}

function main () {
  let { args: files } = commander
  if (!files.length) {
    files = options.patterns || []
  }
  if (files.length) {
    const dynamic = files.some(file => isDynamicPattern(file))
    if (dynamic) {
      processPatterns(files)
    } else {
      for (const file of files) {
        processSource(file, false)
      }
    }
  } else {
    let source = ''
    const stdin = process.openStdin()
    stdin.setEncoding('utf8')
    stdin.on('data', chunk => {
      source += chunk.toString('utf8')
    })
    stdin.on('end', () => {
      const file = '<stdin>'
      if (options.logFiles && !(options.compact || options.check || options.diff)) {
        console.info(file)
      }
      const parsed = processContents(source, file)
      if (options.check) {
        checkContents(file, source, ensureLineBreak(parsed, source))
      } else if (options.diff) {
        diffContents(file, source, ensureLineBreak(parsed, source))
      } else {
        if (options.logFiles && options.compact) {
          console.info(file)
        }
        if (!(options.quiet || options.logFiles)) {
          console.log(parsed)
        }
      }
    })
  }
}

main()

#!/usr/bin/env node

const { readdirSync, readFileSync, statSync, writeFileSync } = require('fs')
const { extname, join } = require('path')
const { isDynamicPattern, sync } = require('fast-glob')
const { parse, tokenize } = require('./jsonlint')
const { format } = require('./formatter')
const { print } = require('./printer')
const { sortObject } = require('./sorter')
const { compile } = require('./validator')

function help() {
  console.log(`${require('../package.json').description}

Usage: jsonlint [options] [--] [<file, directory, pattern> ...]

Options:
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

Examples:
  $ jsonlint myfile.json
  $ jsonlint --in-place --pretty-print mydir
  $ jsonlint --comments --trailing-commas --no-duplicate-keys \\
      --log-files --compact --continue '**/*.json' '!**/node_modules'`)
}

const { argv } = process
let params = { extensions: [], validate: [] }
const args = []

function fail(message) {
  console.error(message)
  process.exit(1)
}

for (let i = 2, l = argv.length; i < l; ++i) {
  const arg = argv[i]
  const match = /^(-|--)(no-)?([a-zA-Z][-a-zA-Z]*)(?:=(.*))?$/.exec(arg)
  if (match) {
    const parseArg = (arg, flag) => {
      switch (arg) {
        case 'f': case 'config':
          params.config = flag ? match[4] || argv[++i] : false
          return
        case 'F':
          params.config = false
          return
        case 's': case 'sort-keys':
          params.sortKeys = flag
          return
        case 'E': case 'extensions':
          arg = match[4] || argv[++i]
          params.extensions.push(...arg.split(','))
          return
        case 'i': case 'in-place':
          params.inPlace = flag
          return
        case 'j': case 'diff':
          params.diff = flag
          return
        case 'k': case 'check':
          params.check = flag
          return
        case 't': case 'indent':
          arg = match[4] || argv[++i]
          if (arg.trim().length > 0 && !isNaN(+arg)) arg = +arg
          params.indent = arg
          return
        case 'c': case 'compact':
          params.compact = flag
          return
        case 'M': case 'mode':
          arg = match[4] || argv[++i]
          if (arg !== 'json' && arg !== 'cjson' && arg !== 'json5') {
            throw new Error(`invalid parsing mode: "${arg}"`)
          }
          params.mode = arg
          return
        case 'B': case 'bom':
          params.bom = flag
          return
        case 'C': case 'comments':
          params.comments = flag
          return
        case 'S': case 'single-quoted-strings':
          params.singleQuotedStrings = flag
          return
        case 'T': case 'trailing-commas':
          params.trailingCommas = flag
          return
        case 'duplicate-keys':
          params.duplicateKeys = flag
          return
        case 'D':
          params.duplicateKeys = false
          return
        case 'V': case 'validate':
          arg = match[4] || argv[++i]
          params.validate.push(...arg.split(','))
          return
        case 'e': case 'environment':
          arg = match[4] || argv[++i]
          if (arg !== 'json-schema-draft-04' && arg !== 'draft-04' &&
              arg !== 'json-schema-draft-06' && arg !== 'draft-06' &&
              arg !== 'json-schema-draft-07' && arg !== 'draft-07' &&
              arg !== 'json-schema-draft-2019-09' && arg !== 'draft-2019-09' &&
              arg !== 'json-schema-draft-2020-12' && arg !== 'draft-2020-12' &&
              arg !== 'json-type-definition' && arg !== 'jtd' && arg !== 'rfc8927') {
            throw new Error(`invalid validation environment "${arg}"`)
          }
          params.environment = arg
          return
        case 'x': case 'context':
          arg = match[4] || argv[++i]
          if (isNaN(+arg)) {
            throw new Error(`invalid diff context: "${arg}"`)
          }
          params.indent = +arg
          return
        case 'l': case 'log-files':
          params.logFiles = flag
          return
        case 'q': case 'quiet':
          params.quiet = flag
          return
        case 'n': case 'continue':
          params.continue = flag
          return
        case 'p': case 'pretty-print':
          params.prettyPrint = flag
          return
        case 'P': case 'pretty-print-invalid':
          params.prettyPrintInvalid = flag
          return
        case 'r': case 'trailing-newline':
          params.trailingNewline = flag
          return
        case 'R':
          params.trailingNewline = false
          return
        case 'prune-comments':
          params.pruneComments = flag
          return
        case 'strip-object-keys':
          params.stripObjectKeys = flag
          return
        case 'enforce-double-quotes':
          params.enforceDoubleQuotes = flag
          return
        case 'enforce-single-quotes':
          params.enforceSingleQuotes = flag
          return
        case 'trim-trailing-commas':
          params.trimTrailingCommas = flag
          return
        case 'v': case 'version':
          console.log(require('../package.json').version)
          process.exit(0)
          break
        case 'h': case 'help':
          help()
          process.exit(0)
      }
      fail(`unknown option: "${arg}"`)
    }
    if (match[1] === '-') {
      const flags = match[3].split('')
      for (const flag of flags) parseArg(flag, true)
    } else {
      parseArg(match[3], match[2] !== 'no-')
    }
    continue
  }
  if (arg === '--') {
    args.push(...argv.slice(i + 1, l))
    break
  }
  args.push(arg)
}

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

if (params.config !== false) {
  const { cosmiconfigSync } = require('cosmiconfig')
  const configurator = cosmiconfigSync('jsonlint')
  const { config = {} } = (params.config && configurator.load(params.config)) ||
    configurator.search() || {}
  params = mergeOptions({}, convertConfig(config), params)
}

let extensions = params.extensions.map(extension => `.${extension}`)
if (!extensions.length) extensions = ['.json', '.JSON']
if (!params.mode) params.mode = 'json'
if (params.indent == null) params.indent = 2
if (params.context == null) params.context = 3

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
      if (target[key] == null || Array.isArray(target[key]) && !target[key].length === 0) {
        target[key] = source[key]
      }
    }
  }
  return target
}

function separateBlocks () {
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
      mode: params.mode,
      ignoreBOM: params.bom,
      ignoreComments: params.comments,
      ignoreTrailingCommas: params.trailingCommas,
      allowSingleQuotedStrings: params.singleQuotedStrings,
      allowDuplicateObjectKeys: params.duplicateKeys
    }
    if (params.validate.length) {
      const schemas = params.validate.map((file, index) => {
        try {
          return readFileSync(file, 'utf8')
        } catch (error) {
          throw new Error(`Loading the JSON Schema #${index + 1} failed: "${file}".\n${error.message}`)
        }
      })
      parserOptions.environment = params.environment
      try {
        validate = compile(schemas, parserOptions)
      } catch (error) {
        throw new Error(`Loading the JSON Schema failed:\n${error.message}`)
      }
      parsed = validate(source, parserOptions)
    } else {
      parsed = parse(source, parserOptions)
    }
    if (params.prettyPrint) {
      parserOptions.rawTokens = true
      const tokens = tokenize(source, parserOptions)
      // TODO: Support sorting tor the tokenized input too.
      return print(tokens, {
        indent: params.indent,
        pruneComments: params.pruneComments,
        stripObjectKeys: params.stripObjectKeys,
        enforceDoubleQuotes: params.enforceDoubleQuotes,
        enforceSingleQuotes: params.enforceSingleQuotes,
        trimTrailingCommas: params.trimTrailingCommas
      })
    }
    if (params.sortKeys) {
      parsed = sortObject(parsed)
    }
    return JSON.stringify(parsed, null, params.indent)
  } catch (e) {
    if (params.prettyPrintInvalid) {
      /* From https://github.com/umbrae/jsonlintdotcom:
       * If we failed to validate, run our manual formatter and then re-validate so that we
       * can get a better line number. On a successful validate, we don't want to run our
       * manual formatter because the automatic one is faster and probably more reliable.
       */
      try {
        formatted = format(source, params.indent)
        // Re-parse so exception output gets better line numbers
        parsed = parse(formatted)
      } catch (e) {
        if (params.compact) {
          logCompactError(e, file)
        } else {
          logNormalError(e, file)
        }
        // force the pretty print before exiting
        console.log(formatted)
      }
    } else {
      if (params.compact) {
        logCompactError(e, file)
      } else {
        logNormalError(e, file)
      }
    }
    if (params.continue) {
      process.exitCode = 1
    } else {
      process.exit(1)
    }
  }
}

function ensureLineBreak (parsed, source) {
  const lines = source.split(/\r?\n/)
  const newLine = !lines[lines.length - 1]
  if (params.trailingNewline === true ||
      (params.trailingNewline !== false && newLine)) {
    parsed += '\n'
  }
  return parsed
}

function checkContents (file, source, parsed) {
  const { createTwoFilesPatch, structuredPatch } = require('diff')
  const structured = structuredPatch(`${file}.orig`, file, source, parsed, '', '', { context: params.context })
  const length = structured.hunks && structured.hunks.length
  if (length > 0) {
    const hunk = length === 1 ? 'hunk differs' : 'hunks differ'
    const message = `${length} ${hunk}`
    if (params.compact) {
      console.error(`${file}: ${message}`)
    } else {
      separateBlocks()
      console.info('File:', file)
      console.error(message)
    }
    if (!params.quiet) {
      const diff = createTwoFilesPatch(`${file}.orig`, file, source, parsed, '', '', { context: params.context })
      console.log(diff)
    }
    if (params.continue) {
      process.exitCode = 1
    } else {
      process.exit(1)
    }
  } else {
    if (params.compact) {
      console.info(`${file}: no difference`)
    } else if (params.logFiles) {
      console.info(file)
    }
  }
}

function diffContents (file, source, parsed) {
  const { createTwoFilesPatch, structuredPatch } = require('diff')
  const compact = params.quiet || params.compact
  let diff, length
  if (compact) {
    diff = structuredPatch(`${file}.orig`, file, source, parsed, '', '', { context: params.context })
    length = diff.hunks && diff.hunks.length
  } else {
    diff = createTwoFilesPatch(`${file}.orig`, file, source, parsed, '', '', { context: params.context })
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
    if (params.compact) {
      console.info(`${file}: no difference`)
    } else if (params.logFiles) {
      console.info(file)
    }
  }
}

function processFile (file) {
  if (params.logFiles && !(params.compact || params.check || params.diff)) {
    console.info(file)
  }
  const source = readFileSync(file, 'utf8')
  const parsed = processContents(source, file)
  if (params.inPlace) {
    if (params.logFiles && params.compact) {
      console.info(file)
    }
    writeFileSync(file, ensureLineBreak(parsed, source))
  } else if (params.check) {
    checkContents(file, source, ensureLineBreak(parsed, source))
  } else if (params.diff) {
    diffContents(file, source, ensureLineBreak(parsed, source))
  } else {
    if (!(params.quiet || params.logFiles)) {
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
  const files = args.length && args || params.patterns || []
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
      if (params.logFiles && !(params.compact || params.check || params.diff)) {
        console.info(file)
      }
      const parsed = processContents(source, file)
      if (params.check) {
        checkContents(file, source, ensureLineBreak(parsed, source))
      } else if (params.diff) {
        diffContents(file, source, ensureLineBreak(parsed, source))
      } else {
        if (params.logFiles && params.compact) {
          console.info(file)
        }
        if (!(params.quiet || params.logFiles)) {
          console.log(parsed)
        }
      }
    })
  }
}

main()

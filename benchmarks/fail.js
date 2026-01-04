const createGuard = require('./common/createGuard')

const chevrotainParse = require('./chevrotain/pure')
const handbuiltParse = require('./hand-built/pure')
const { parse: jjuParse } = require('./jju/pure')
const { parse: pegjsParse } = require('./pegjs/pure')
const jisonParser = require('./jison/pure').parser
const JSON5 = require('json5')
const JSON6 = require('json-6')
const { parse: parseWithComments } = require('comment-json')
const { parse: parseMomoa } = require("@humanwhocodes/momoa");
const parseRyanGrove = require("./ryan-grove/pure");

const inputSources = [
  `{
  # Sets a value to a property.
  "property": "value"
}`,
  `{
  1,
  "property": "value"
}`,
  `{
  "property" "value"
}`,
  `{
  "property":
}`,
  `{
  "property": "value"
  "count": 1
}`,
  `{
  "property": "value",
}`,
  `{
  "property": "value"`,
  ' ',
  ''
]
let inputSource

function getOffset (line, column) {
  if (line > 1) {
    const breaks = /\r?\n/g
    let match
    while ((match = breaks.exec(inputSource))) {
      if (--line === 1) {
        return match.index + column
      }
    }
  }
  return column - 1
}

function getLineAndColumn (offset) {
  const lines = inputSource
    .substr(0, offset)
    .split(/\r?\n/)
  const line = lines.length
  const column = lines[line - 1].length + 1
  return { line, column }
}

function pastInput ({ offset }) {
  const start = Math.max(0, offset - 20)
  const previous = inputSource.substr(start, offset - start)
  return (offset > 20 ? '...' : '') + previous.replace(/\r?\n/g, '')
}

function upcomingInput ({ offset }) {
  let start = Math.max(0, offset - 20)
  start += offset - start
  const rest = inputSource.length - start
  const next = inputSource.substr(start, Math.min(20, rest))
  return next.replace(/\r?\n/g, '') + (rest > 20 ? '...' : '')
}

function showPosition ({ offset }) {
  const past = pastInput({ offset })
  const upcoming = upcomingInput({ offset })
  const c = new Array(past.length + 1).join('-')
  return `${past}${upcoming}\n${c}^`
}

// Workaround for missing column number in jison error output.
function parseError (message, hash) {
  const match = /Parse error on line (\d+):/.exec(message)
  if (match) {
    const loc = parseError.yy.yylloc
    message = message.substr(0, match.index) +
      `Parse error on line ${match[1]}` +
      (loc ? `, column ${loc.first_column + 1}:` : ':') +
      message.substr(match.index + match[0].length)
  }
  if (hash.recoverable) {
    this.trace(message)
  } else {
    const error = new SyntaxError(message)
    error.hash = hash
    throw error
  }
}

jisonParser.yy.parseError = parseError

function improveJSONError (error) {
  let { message } = error
  const match = / in JSON at position (\d+)$/.exec(message)
  let offset
  if (match) {
    offset = +match[1]
    message = message.substr(0, match.index)
  } else {
    offset = inputSource.length
  }
  const { line, column } = getLineAndColumn(offset)
  const cursor = `line ${line}, column ${column}`
  const position = showPosition({ offset })
  error.message = `Parse error on ${cursor}:\n${position}\n${message}`
  throw error
}

function parseBuiltIn () {
  try {
    JSON.parse(inputSource)
  } catch (error) {
    improveJSONError(error)
  }
}

function parseChevrotain () {
  let { lexErrors, parseErrors } = chevrotainParse(inputSource)
  let type, line, column, offset, message
  if (lexErrors.length || parseErrors.length) {
    if (lexErrors.length && parseErrors.length) {
      const { line: lexLine, column: lexColumn } = lexErrors[0]
      const { startLine: parseLine, startColumn: parseColumn } = parseErrors[0].token
      if (lexLine < parseLine || lexColumn < parseColumn) {
        parseErrors = []
      } else {
        lexErrors = []
      }
    }
  }
  if (lexErrors.length) {
    ({ line, column, offset, message } = lexErrors[0])
    type = 'Lexical'
  } else if (parseErrors.length) {
    let token
    ({ message, token } = parseErrors[0]);
    ({ startLine: line, startColumn: column, startOffset: offset } = token)
    type = 'Parse'
  }
  if (message) {
    if (isNaN(line)) {
      offset = inputSource.length;
      ({ line, column } = getLineAndColumn(offset))
    }
    const cursor = `line ${line}, column ${column}`
    const position = showPosition({ offset })
    message = message.charAt(0).toUpperCase() + message.substr(1)
    throw new SyntaxError(`${type} error on ${cursor}:\n${position}\n${message}`)
  }
}

function parseHandbuilt () {
  handbuiltParse(inputSource)
}

function improveJjuError (error) {
  const { message, row, column } = error
  const cursor = `line ${row}, column ${column}`
  const offset = getOffset(row, column)
  const position = showPosition({ offset })
  const reason = message
    .split(/\r?\n/)[0]
    .replace(/ at \d+:\d+$/, '')
  error.message = `Parse error on ${cursor}:\n${position}\n${reason}`
  throw error
}

function parseJju () {
  try {
    jjuParse(inputSource)
  } catch (error) {
    improveJjuError(error)
  }
}

function parseCommentJson () {
  parseWithComments(inputSource)
}

function improvePegjsError (error) {
  const { message, location } = error
  const { line, column, offset } = location.start
  const cursor = `line ${line}, column ${column}`
  const position = showPosition({ offset })
  error.message = `Parse error on ${cursor}:\n${position}\n${message}`
  throw error
}

function parsePegjs () {
  try {
    pegjsParse(inputSource)
  } catch (error) {
    improvePegjsError(error)
  }
}

function parseJison () {
  jisonParser.parse(inputSource, { allowSingleQuotedStrings: true })
}

function improveJSON5Error (error) {
  let { message, lineNumber, columnNumber } = error
  const cursor = `line ${lineNumber}, column ${columnNumber}`
  const offset = getOffset(lineNumber, columnNumber)
  const position = showPosition({ offset })
  message = message
    .replace(/^JSON5: /, '')
    .replace(/ at \d+:\d+$/, '')
  message = message.charAt(0).toUpperCase() + message.substr(1)
  error.message = `Parse error on ${cursor}:\n${position}\n${message}`
  throw error
}

function parseJSON5 () {
  try {
    JSON5.parse(inputSource)
  } catch (error) {
    improveJSON5Error(error)
  }
}

function improveJSON6Error (error) {
  let { message } = error
  message = message.replaceAll('\n', ' ')
  let [, lineNumber, columnNumber] = / \[(\d+):(\d+)\]$/.exec(message)
  --columnNumber
  const cursor = `line ${lineNumber}, column ${columnNumber}`
  const offset = getOffset(lineNumber, columnNumber)
  const position = showPosition({ offset })
  message = message
    .replace(/ \[\d+:\d+\]$/, '')
    .replace(/ \(near '.+'\)$/, '')
    .replace(/ unexpected at \d+$/, '')
  message = message.charAt(0).toUpperCase() + message.substr(1)
  error.message = `Parse error on ${cursor}:\n${position}\n${message}`
  throw error
}

function parseJSON6 () {
  try {
    JSON6.parse(inputSource)
  } catch (error) {
    improveJSON6Error(error)
  }
}

function improveMomoaError (error) {
  let { message, line, column, offset } = error
  if (line === undefined) throw error
  const cursor = `line ${line}, column ${column}`
  const position = showPosition({ offset })
  message = message.replace(/ \(\d+:\d+\)$/, '')
  error.message = `Parse error on ${cursor}:\n${position}\n${message}`
  throw error
}

function parseMomoaJson () {
  try {
    parseMomoa(inputSource)
  } catch (error) {
    improveMomoaError(error)
  }
}

function parseRyanGroveJson () {
  parseRyanGrove(inputSource)
}

for (const test of inputSources) {
  inputSource = test
  const formattedTest = test
    .split(/\r?\n/)
    .map(line => '  ' + line)
    .join('\n')
  createGuard(`Parsing invalid JSON data:\n${formattedTest}\nusing`)
    .add('the built-in parser', parseBuiltIn)
    .add('the chevrotain parser', parseChevrotain)
    .add('the hand-built parser', parseHandbuilt)
    .add('the jju parser', parseJju)
    .add('the comment-json parser', parseCommentJson)
    .add('the pegjs parser', parsePegjs)
    .add('the jison parser', parseJison)
    .add('the JSON5 parser', parseJSON5)
    .add('the JSON6 parser', parseJSON6)
    .add('the Momoa parser', parseMomoaJson)
    .add('the Ryan Grove parser', parseRyanGroveJson)
    .start()
  console.log()
}

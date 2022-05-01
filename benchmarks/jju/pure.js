// Modified from https://github.com/rlidwka/jju/blob/master/lib/parse.js

const Uni = require('./unicode')

function isHexDigit (x) {
  return (x >= '0' && x <= '9') ||
      (x >= 'A' && x <= 'F') ||
      (x >= 'a' && x <= 'f')
}

function isDecDigit (x) {
  return x >= '0' && x <= '9'
}

const unescapeMap = {
  '"': '"',
  '\\': '\\',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t',
  '/': '/'
}

function formatError (input, message, position, lineNumber, column) {
  const result = message + ' at ' + (lineNumber + 1) + ':' + (column + 1)

  let startPosition = position - column - 1

  let sourceLine = ''

  let underline = ''

  const isLineTerminator = Uni.isLineTerminatorJSON

  // output no more than 70 characters before the wrong ones
  if (startPosition < position - 70) {
    startPosition = position - 70
  }

  while (1) {
    const chr = input[++startPosition]

    if (isLineTerminator(chr) || startPosition === input.length) {
      if (position >= startPosition) {
        // ending line error, so show it after the last char
        underline += '^'
      }
      break
    }
    sourceLine += chr

    if (position === startPosition) {
      underline += '^'
    } else if (position > startPosition) {
      underline += input[startPosition] === '\t' ? '\t' : ' '
    }

    // output no more than 78 characters on the string
    if (sourceLine.length > 78) break
  }

  return result + '\n' + sourceLine + '\n' + underline
}

function parse (input) {
  const isLineTerminator = Uni.isLineTerminatorJSON
  const isWhiteSpace = Uni.isWhiteSpaceJSON

  const length = input.length

  let lineNumber = 0
  let lineStart = 0
  let position = 0

  const stack = []

  function fail (message) {
    const column = position - lineStart

    if (!message) {
      if (position < length) {
        const token = '\'' +
          JSON
            .stringify(input[position])
            .replace(/^"|"$/g, '')
            .replace(/'/g, "\\'")
            .replace(/\\"/g, '"') +
          '\''

        if (!message) message = 'Unexpected token ' + token
      } else {
        if (!message) message = 'Unexpected end of input'
      }
    }

    const error = SyntaxError(formatError(input, message, position, lineNumber, column))
    error.row = lineNumber + 1
    error.column = column + 1
    throw error
  }

  function newLine (chr) {
    // account for <cr><lf>
    if (chr === '\r' && input[position] === '\n') position++
    lineStart = position
    lineNumber++
  }

  function parseGeneric () {
    while (position < length) {
      const chr = input[position++]
      if (chr === '"') {
        return parseString(chr)
      } else if (chr === '{') {
        return parseObject()
      } else if (chr === '[') {
        return parseArray()
      } else if (chr === '-' || chr === '.' || isDecDigit(chr)) {
        return parseNumber()
      } else if (chr === 'n') {
        parseKeyword('null')
        return null
      } else if (chr === 't') {
        parseKeyword('true')
        return true
      } else if (chr === 'f') {
        parseKeyword('false')
        return false
      } else {
        position--
        return undefined
      }
    }
  }

  function parseKey () {
    let result

    while (position < length) {
      const chr = input[position++]
      if (chr === '"') {
        return parseString(chr)
      } else if (chr === '{') {
        return parseObject()
      } else if (chr === '[') {
        return parseArray()
      } else if (chr === '.' || isDecDigit(chr)) {
        return parseNumber(true)
      } else if (chr === '\\' && input[position] === 'u') {
        // unicode char or a unicode sequence
        const rollback = position - 1
        result = parseIdentifier()
        if (result === undefined) {
          position = rollback
          return undefined
        } else {
          return result
        }
      } else {
        position--
        return undefined
      }
    }
  }

  function skipWhiteSpace () {
    while (position < length) {
      const chr = input[position++]
      if (isLineTerminator(chr)) {
        newLine(chr)
      } else if (isWhiteSpace(chr)) {
        // nothing
      } else {
        position--
        break
      }
    }
    return undefined
  }

  function parseKeyword (keyword) {
    // keyword[0] is not checked because it should've checked earlier
    const startPosition = position
    const len = keyword.length
    for (let i = 1; i < len; i++) {
      if (position >= length || keyword[i] !== input[position]) {
        position = startPosition - 1
        fail()
      }
      position++
    }
  }

  function parseObject () {
    const result = {}
    const emptyObject = {}
    let isNotEmpty = false

    while (position < length) {
      skipWhiteSpace()
      const key = parseKey()
      skipWhiteSpace()
      let chr = input[position++]

      if (chr === '}' && key === undefined) {
        if (isNotEmpty) {
          position--
          fail('Trailing comma in object')
        }
        return result
      } else if (chr === ':' && key !== undefined) {
        skipWhiteSpace()
        stack.push(key)
        const value = parseGeneric()
        stack.pop()

        if (value === undefined) fail('No value found for key ' + key)
        if (typeof key !== 'string') {
          fail('Wrong key type: ' + key)
        }

        if (key in emptyObject || emptyObject[key] != null) {
          // silently ignore it
        } else {
          if (value !== undefined) {
            isNotEmpty = true
            result[key] = value
          }
        }

        skipWhiteSpace()

        chr = input[position++]

        if (chr === ',') {
          continue
        } else if (chr === '}') {
          return result
        } else {
          fail()
        }
      } else {
        position--
        fail()
      }
    }

    fail()
  }

  function parseArray () {
    const result = []

    while (position < length) {
      skipWhiteSpace()
      stack.push(result.length)
      let item = parseGeneric()
      stack.pop()
      skipWhiteSpace()
      const chr = input[position++]

      if (item !== undefined) {
        if (item === undefined) {
          result.length++
          item = true // hack for check below, not included into result
        } else {
          result.push(item)
        }
      }

      if (chr === ',') {
        if (item === undefined) {
          fail('Elisions are not supported')
        }
      } else if (chr === ']') {
        if (item === undefined && result.length) {
          position--
          fail('Trailing comma in array')
        }
        return result
      } else {
        position--
        fail()
      }
    }
  }

  function parseNumber () {
    // rewind because we don't know first char
    position--

    const start = position

    let chr = input[position++]

    const toNumber = function () {
      const str = input.substr(start, position - start)
      const result = Number(str)

      if (Number.isNaN(result)) {
        position--
        fail('Bad numeric literal - "' + input.substr(start, position - start + 1) + '"')
      } else if (!str.match(/^-?(0|[1-9][0-9]*)(\.[0-9]+)?(e[+-]?[0-9]+)?$/i)) {
        // additional restrictions imposed by json
        position--
        fail('Non-json numeric literal - "' + input.substr(start, position - start + 1) + '"')
      } else {
        return result
      }
    }

    // ex: -5982475.249875e+29384
    //     ^ skipping this
    if (chr === '-') chr = input[position++]

    if (chr >= '1' && chr <= '9') {
      // ex: -5982475.249875e+29384
      //        ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    // special case for leading zero: 0.123456
    if (chr === '0') {
      chr = input[position++]
    }

    if (chr === '.') {
      // ex: -5982475.249875e+29384
      //                ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    if (chr === 'e' || chr === 'E') {
      chr = input[position++]
      if (chr === '-' || chr === '+') position++
      // ex: -5982475.249875e+29384
      //                       ^^^ skipping these
      while (position < length && isDecDigit(input[position])) position++
      chr = input[position++]
    }

    // we have char in the buffer, so count for it
    position--
    return toNumber()
  }

  function parseIdentifier () {
    // rewind because we don't know first char
    position--

    let result = ''

    while (position < length) {
      let chr = input[position++]

      if (chr === '\\' &&
      input[position] === 'u' &&
      isHexDigit(input[position + 1]) &&
      isHexDigit(input[position + 2]) &&
      isHexDigit(input[position + 3]) &&
      isHexDigit(input[position + 4])
      ) {
        // UnicodeEscapeSequence
        chr = String.fromCharCode(parseInt(input.substr(position + 1, 4), 16))
        position += 5
      }

      if (result.length) {
        // identifier started
        if (Uni.isIdentifierPart(chr)) {
          result += chr
        } else {
          position--
          return result
        }
      } else {
        if (Uni.isIdentifierStart(chr)) {
          result += chr
        } else {
          return undefined
        }
      }
    }

    fail()
  }

  function parseString (endChar) {
    // 7.8.4 of ES262 spec
    let result = ''

    while (position < length) {
      let chr = input[position++]

      if (chr === endChar) {
        return result
      } else if (chr === '\\') {
        if (position >= length) fail()
        chr = input[position++]

        if (unescapeMap[chr]) {
          result += unescapeMap[chr]
        } else if (chr === 'u') {
          // unicode/character escape sequence
          const off = chr === 'u' ? 4 : 2

          // validation for \uXXXX
          for (let i = 0; i < off; i++) {
            if (position >= length) fail()
            if (!isHexDigit(input[position])) fail('Bad escape sequence')
            position++
          }

          result += String.fromCharCode(parseInt(input.substr(position - off, off), 16))
        } else {
          position--
          fail()
        }
      } else if (isLineTerminator(chr)) {
        fail()
      } else {
        if (chr.charCodeAt(0) < 32) {
          position--
          fail('Unexpected control character')
        }

        // SourceCharacter but not one of " or \ or LineTerminator
        result += chr
      }
    }

    fail()
  }

  skipWhiteSpace()
  const returnValue = parseGeneric()
  if (returnValue !== undefined || position < length) {
    skipWhiteSpace()

    if (position >= length) {
      return returnValue
    } else {
      fail()
    }
  } else {
    if (position) {
      fail('No data, only a whitespace')
    } else {
      fail('No data, empty input')
    }
  }
}

/*
 * parse(text)
 *
 * where:
 * text - string
 */
module.exports.parse = function parseJSON (input) {
  // JSON.parse compat
  if (typeof input !== 'string' || !(input instanceof String)) input = String(input)

  try {
    return parse(input)
  } catch (error) {
    // jju is a recursive parser, so JSON.parse("{{{{{{{") could blow up the stack
    //
    // this catch is used to skip all those internal calls
    if (error instanceof SyntaxError && error.row != null && error.column != null) {
      const syntaxError = SyntaxError(error.message)
      syntaxError.column = error.column
      syntaxError.row = error.row
      throw syntaxError
    }
    throw error
  }
}

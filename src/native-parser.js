function getLineAndColumn (input, offset) {
  const lines = input
    .substr(0, offset)
    .split(/\r?\n/)
  const line = lines.length
  const column = lines[line - 1].length + 1
  return {
    line,
    column
  }
}

function getOffset (input, line, column) {
  if (line > 1) {
    const breaks = /\r?\n/g
    let match
    while ((match = breaks.exec(input))) {
      if (--line === 1) {
        return match.index + column
      }
    }
  }
  return column - 1
}

function pastInput (input, offset) {
  const start = Math.max(0, offset - 20)
  const previous = input.substr(start, offset - start)
  return (offset > 20 ? '...' : '') + previous.replace(/\r?\n/g, '')
}

function upcomingInput (input, offset) {
  let start = Math.max(0, offset - 20)
  start += offset - start
  const rest = input.length - start
  const next = input.substr(start, Math.min(20, rest))
  return next.replace(/\r?\n/g, '') + (rest > 20 ? '...' : '')
}

function getPositionContext (input, offset) {
  const past = pastInput(input, offset)
  const upcoming = upcomingInput(input, offset)
  const pointer = new Array(past.length + 1).join('-') + '^'
  return {
    excerpt: past + upcoming,
    pointer
  }
}

function getReason (error) {
  let message = error.message
    .replace('JSON.parse: ', '') // SpiderMonkey
    .replace('JSON Parse error: ', '') // SquirrelFish
  const firstCharacter = message.charAt(0)
  if (firstCharacter >= 'a') {
    message = firstCharacter.toUpperCase() + message.substr(1)
  }
  return message
}

function getLocationOnV8 (input, reason) {
  const match = / in JSON at position (\d+)$/.exec(reason)
  if (match) {
    const offset = +match[1]
    const location = getLineAndColumn(input, offset)
    return {
      offset,
      line: location.line,
      column: location.column,
      reason: reason.substr(0, match.index)
    }
  }
}

function checkUnexpectedEndOnV8 (input, reason) {
  const match = / end of JSON input$/.exec(reason)
  if (match) {
    const offset = input.length
    const location = getLineAndColumn(input, offset)
    return {
      offset,
      line: location.line,
      column: location.column,
      reason: reason.substr(0, match.index + 4)
    }
  }
}

function getLocationOnSpiderMonkey (input, reason) {
  const match = / at line (\d+) column (\d+) of the JSON data$/.exec(reason)
  if (match) {
    const line = +match[1]
    const column = +match[2]
    const offset = getOffset(input, line, column) // eslint-disable-line no-undef
    return {
      offset,
      line,
      column,
      reason: reason.substr(0, match.index)
    }
  }
}

function getTexts (reason, input, offset, line, column) {
  const position = getPositionContext(input, offset)
  const excerpt = position.excerpt
  let message, pointer
  if (typeof line === 'number') {
    pointer = position.pointer
    message = 'Parse error on line ' + line + ', column ' +
      column + ':\n' + excerpt + '\n' + pointer + '\n' + reason
  } else {
    message = 'Parse error in JSON input:\n' + excerpt + '\n' + reason
  }
  return {
    message,
    excerpt,
    pointer
  }
}

function improveNativeError (input, error) {
  let reason = getReason(error)
  const location = getLocationOnV8(input, reason) ||
    checkUnexpectedEndOnV8(input, reason) ||
    getLocationOnSpiderMonkey(input, reason)
  let offset, line, column
  if (location) {
    offset = location.offset
    line = location.line
    column = location.column
    reason = location.reason
  } else {
    offset = 0
  }
  error.reason = reason
  const texts = getTexts(reason, input, offset, line, column)
  error.message = texts.message
  error.excerpt = texts.excerpt
  if (texts.pointer) {
    error.pointer = texts.pointer
    error.location = {
      start: {
        column,
        line,
        offset
      }
    }
  }
  return error
}

// eslint-disable-next-line no-unused-vars
function parseNative (input, reviver) {
  try {
    return JSON.parse(input, reviver)
  } catch (error) {
    throw improveNativeError(input, error)
  }
}

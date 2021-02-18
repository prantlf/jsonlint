function getLineAndColumn (input, offset) {
  var lines = input
    .substr(0, offset)
    .split(/\r?\n/)
  var line = lines.length
  var column = lines[line - 1].length + 1
  return {
    line: line,
    column: column
  }
}

function getOffset(input, line, column) {
  if (line > 1) {
    var breaks = /\r?\n/g;
    var match;
    while (match = breaks.exec(input)) { // eslint-disable-line no-cond-assign
      if (--line === 1) {
        return match.index + column;
      }
    }
  }
  return column - 1;
}

function pastInput (input, offset) {
  var start = Math.max(0, offset - 20)
  var previous = input.substr(start, offset - start)
  return (offset > 20 ? '...' : '') + previous.replace(/\r?\n/g, '')
}

function upcomingInput (input, offset) {
  var start = Math.max(0, offset - 20)
  start += offset - start
  var rest = input.length - start
  var next = input.substr(start, Math.min(20, rest))
  return next.replace(/\r?\n/g, '') + (rest > 20 ? '...' : '')
}

function getPositionContext (input, offset) {
  var past = pastInput(input, offset)
  var upcoming = upcomingInput(input, offset)
  var pointer = new Array(past.length + 1).join('-') + '^'
  return {
    excerpt: past + upcoming,
    pointer: pointer
  }
}

function getReason (error) {
  var message = error.message
    .replace('JSON.parse: ', '') // SpiderMonkey
    .replace('JSON Parse error: ', '') // SquirrelFish
  var firstCharacter = message.charAt(0)
  if (firstCharacter >= 'a') {
    message = firstCharacter.toUpperCase() + message.substr(1)
  }
  return message
}

function getLocationOnV8 (input, reason) {
  var match = / in JSON at position (\d+)$/.exec(reason)
  if (match) {
    var offset = +match[1]
    var location = getLineAndColumn(input, offset)
    return {
      offset: offset,
      line: location.line,
      column: location.column,
      reason: reason.substr(0, match.index)
    }
  }
}

function checkUnexpectedEndOnV8 (input, reason) {
  var match = / end of JSON input$/.exec(reason)
  if (match) {
    var offset = input.length
    var location = getLineAndColumn(input, offset)
    return {
      offset: offset,
      line: location.line,
      column: location.column,
      reason: reason.substr(0, match.index + 4)
    }
  }
}

function getLocationOnSpiderMonkey (input, reason) {
  var match = / at line (\d+) column (\d+) of the JSON data$/.exec(reason)
  if (match) {
    var line = +match[1]
    var column = +match[2]
    var offset = getOffset(input, line, column) // eslint-disable-line no-undef
    return {
      offset: offset,
      line: line,
      column: column,
      reason: reason.substr(0, match.index)
    }
  }
}

function getTexts (reason, input, offset, line, column) {
  var position = getPositionContext(input, offset)
  var excerpt = position.excerpt
  var message, pointer
  if (typeof line === 'number') {
    pointer = position.pointer
    message = 'Parse error on line ' + line + ', column ' +
      column + ':\n' + excerpt + '\n' + pointer + '\n' + reason
  } else {
    message = 'Parse error in JSON input:\n' + excerpt + '\n' + reason
  }
  return {
    message: message,
    excerpt: excerpt,
    pointer: pointer
  }
}

function improveNativeError (input, error) {
  var reason = getReason(error)
  var location = getLocationOnV8(input, reason) ||
    checkUnexpectedEndOnV8(input, reason) ||
    getLocationOnSpiderMonkey(input, reason)
  var offset, line, column
  if (location) {
    offset = location.offset
    line = location.line
    column = location.column
    reason = location.reason
  } else {
    offset = 0
  }
  error.reason = reason
  var texts = getTexts(reason, input, offset, line, column)
  error.message = texts.message
  error.excerpt = texts.excerpt
  if (texts.pointer) {
    error.pointer = texts.pointer
    error.location = {
      start: {
        column: column,
        line: line,
        offset: offset
      }
    }
  }
  return error
}

function parseNative (input, reviver) { // eslint-disable-line no-unused-vars
  try {
    return JSON.parse(input, reviver)
  } catch (error) {
    throw improveNativeError(input, error)
  }
}

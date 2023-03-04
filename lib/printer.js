(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports)
    : typeof define === 'function' && define.amd ? define('jsonlint-printer', ['exports'], factory)
      : (global = global || self, factory(global.jsonlintPrinter = {}))
}(this, function (exports) {
  'use strict'

  function noop () {}

  function isIdentifierName (value) {
    return /^[a-zA-Z$_][a-zA-Z0-9$_]*$/.test(value)
  }

  function concatenateTokens (tokens) {
    let outputString = ''
    const tokenCount = tokens.length
    let tokenIndex
    for (tokenIndex = 0; tokenIndex < tokenCount; ++tokenIndex) {
      outputString += tokens[tokenIndex].raw
    }
    return outputString
  }

  function print (tokens, options) {
    if (!(tokens && tokens.length)) {
      throw new Error('JSON tokens missing.')
    }
    // Whitespace and comments are available only as raw token content.
    if (!(tokens[0] && tokens[0].raw)) {
      throw new Error('JSON tokens lack raw values.')
    }

    if (!options) {
      // If no options, not even an empty object is passed, just concatenate
      // the raw tokens with neither minification, nor pretty-printing.
      return concatenateTokens(tokens)
    }

    let indentString = options.indent
    if (typeof indentString === 'number') {
      indentString = new Array(indentString + 1).join(' ')
    }
    // Setting the indent to an empty string enables pretty-printing too.
    // It will just insert line breaks without any indentation.
    const prettyPrint = indentString !== undefined
    const pruneComments = options.pruneComments
    const stripObjectKeys = options.stripObjectKeys
    const enforceDoubleQuotes = options.enforceDoubleQuotes
    const enforceSingleQuotes = options.enforceSingleQuotes
    const trimTrailingCommas = options.trimTrailingCommas

    let outputString = ''
    let foundLineBreak, addedLineBreak, needsLineBreak
    let addedSpace, needsSpace
    let indentLevel = 0
    const scopes = []
    let scopeType
    let isValue
    const tokenCount = tokens.length
    let tokenIndex, token, tokenType, tokenContent

    function peekAtNextToken () {
      let nextTokenIndex = tokenIndex
      let nextToken
      do {
        nextToken = tokens[++nextTokenIndex]
      } while (nextToken && (nextToken.type === 'whitespace' ||
                             nextToken.type === 'comment'))
      return nextToken
    }

    let addIndent
    if (prettyPrint && indentString) {
      addIndent = function () {
        for (let i = 0; i < indentLevel; ++i) {
          outputString += indentString
        }
      }
    } else {
      addIndent = noop
    }

    let addLineBreak, addDelayedSpaceOrLineBreak
    if (prettyPrint) {
      addLineBreak = function () {
        outputString += '\n'
      }

      addDelayedSpaceOrLineBreak = function () {
        // A line break is more important than a space.
        if (needsLineBreak) {
          addLineBreak()
          addIndent()
        } else if (needsSpace) {
          outputString += ' '
        }
        needsSpace = needsLineBreak = false
      }
    } else {
      addLineBreak = addDelayedSpaceOrLineBreak = noop
    }

    let addStandaloneComment, tryAddingInlineComment
    if (pruneComments) {
      addStandaloneComment = tryAddingInlineComment = noop
    } else {
      if (prettyPrint) {
        addStandaloneComment = function () {
          // If a comment is not appended to the end of a line, it will start
          // on a new line with the current indentation.
          if (!addedLineBreak && tokenIndex > 0) {
            addLineBreak()
            addIndent()
          }
          outputString += tokenContent
          foundLineBreak = false
          addedLineBreak = false
          // If a comment is not appended to the end of a line, it will take
          // the whole line and has to end by a line break.
          needsLineBreak = true
        }

        tryAddingInlineComment = function () {
          // This function is called after printing a non-line-break character.
          foundLineBreak = false
          addedLineBreak = false
          addedSpace = false

          // Start with the character after the just processed one.
          let tryTokenIndex = tokenIndex + 1

          function skipWhitespace () {
            let token = tokens[tryTokenIndex]
            if (token && token.type === 'whitespace') {
              foundLineBreak = token.raw.indexOf('\n') >= 0
              token = tokens[++tryTokenIndex]
            }
            return token
          }

          const token = skipWhitespace()
          // If line break followed the previous token, leave the comment
          // to be handled by the next usual token processing.
          if (!foundLineBreak && token && token.type === 'comment') {
            if (needsLineBreak) {
              // If the previous non-whitespace token was ended by a line
              // break, retain it. Print the comment after the line break too.
              if (!addedLineBreak) {
                addLineBreak()
                addIndent()
              }
            } else {
              // If the previous non-whitespace token was not ended by a line
              // break, ensure that the comment is separated from it.
              if (!addedSpace) {
                outputString += ' '
              }
            }
            outputString += token.raw
            // Set the current token to the just processed comment.
            tokenIndex = tryTokenIndex++
            // Check the whitespace after the comment to give a hint
            // about the next whitespace to the further processing.
            skipWhitespace()
            if (foundLineBreak) {
              needsSpace = false
              needsLineBreak = true
            } else {
              needsSpace = true
              needsLineBreak = false
            }
          }
        }
      } else {
        // If all whitespace is omitted, convert single-line comments
        // to multi-line ones, which include a comment-closing token.
        addStandaloneComment = function () {
          if (tokenContent[1] === '/') {
            outputString += '/*'
            outputString += tokenContent.substr(2, tokenContent.length - 2)
            outputString += ' */'
          } else {
            outputString += tokenContent
          }
        }

        tryAddingInlineComment = noop
      }
    }

    function addLiteral () {
      addDelayedSpaceOrLineBreak()
      const tokenValue = token.value
      if (stripObjectKeys && scopeType === '{' && !isValue &&
          isIdentifierName(tokenValue)) {
        outputString += tokenValue
      } else if (typeof tokenValue === 'string') {
        if (enforceDoubleQuotes && tokenContent[0] !== '"') {
          outputString += JSON.stringify(tokenValue)
        } else if (enforceSingleQuotes && tokenContent[0] !== '\'') {
          outputString += '\'' + tokenValue.replace(/'/g, '\\\'') + '\''
        } else {
          outputString += tokenContent
        }
      } else {
        outputString += tokenContent
      }
      tryAddingInlineComment()
    }

    function openScope () {
      addDelayedSpaceOrLineBreak()
      scopes.push(scopeType)
      scopeType = tokenContent
      isValue = scopeType === '['
      outputString += tokenContent
      tryAddingInlineComment()
      ++indentLevel
      needsLineBreak = true
    }

    function closeScope () {
      scopeType = scopes.pop()
      addLineBreak()
      --indentLevel
      addIndent()
      needsSpace = needsLineBreak = false
      outputString += tokenContent
      tryAddingInlineComment()
    }

    function addComma () {
      if (trimTrailingCommas) {
        const nextToken = peekAtNextToken()
        if (nextToken && nextToken.type === 'symbol') {
          return tryAddingInlineComment()
        }
      }
      addDelayedSpaceOrLineBreak()
      outputString += ','
      tryAddingInlineComment()
      addLineBreak()
      addIndent()
      addedLineBreak = true
      needsLineBreak = false
      isValue = scopeType === '['
    }

    function addColon () {
      addDelayedSpaceOrLineBreak()
      outputString += ':'
      needsSpace = true
      tryAddingInlineComment()
      isValue = true
    }

    for (tokenIndex = 0; tokenIndex < tokenCount; ++tokenIndex) {
      token = tokens[tokenIndex]
      tokenType = token.type
      tokenContent = token.raw
      switch (tokenType) {
        case 'literal':
          addLiteral()
          break
        case 'comment':
          addStandaloneComment()
          break
        case 'symbol':
          switch (tokenContent) {
            case '{':
            case '[':
              openScope()
              break
            case '}':
            case ']':
              closeScope()
              break
            case ',':
              addComma()
              break
            case ':':
              addColon()
          }
          break
        default: // whitespace
          foundLineBreak = tokenContent.indexOf('\n') >= 0
      }
    }

    return outputString
  }

  exports.print = print

  Object.defineProperty(exports, '__esModule', { value: true })
}))

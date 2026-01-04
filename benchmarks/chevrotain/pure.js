const chevrotain = require('chevrotain')

// ----------------- lexer -----------------
const createToken = chevrotain.createToken
const Lexer = chevrotain.Lexer
const Parser = chevrotain.CstParser

const True = createToken({ name: 'True', pattern: /true/ })
const False = createToken({ name: 'False', pattern: /false/ })
const Null = createToken({ name: 'Null', pattern: /null/ })
const LCurly = createToken({ name: 'LCurly', pattern: /{/ })
const RCurly = createToken({ name: 'RCurly', pattern: /}/ })
const LSquare = createToken({ name: 'LSquare', pattern: /\[/ })
const RSquare = createToken({ name: 'RSquare', pattern: /]/ })
const Comma = createToken({ name: 'Comma', pattern: /,/ })
const Colon = createToken({ name: 'Colon', pattern: /:/ })
const StringLiteral = createToken({
  name: 'StringLiteral',
  pattern: /"(?:[^\\"]|\\(?:[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
})
const NumberLiteral = createToken({
  name: 'NumberLiteral',
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
})
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /[ \t\n\r]+/,
  group: Lexer.SKIPPED
})

const allTokens = [
  WhiteSpace,
  NumberLiteral,
  StringLiteral,
  LCurly,
  RCurly,
  LSquare,
  RSquare,
  Comma,
  Colon,
  True,
  False,
  Null
]
const JsonLexer = new Lexer(allTokens)

// ----------------- parser -----------------
class JsonParserES5 extends Parser {
  constructor() {
    // invoke super constructor
    super(allTokens)

    // not mandatory, using <$> (or any other sign) to reduce verbosity (this. this. this. this. .......)
    const $ = this

    this.RULE('json', function () {
      // prettier-ignore
      $.OR([
        { ALT: function () { $.SUBRULE($.object) } },
        { ALT: function () { $.SUBRULE($.array) } }
      ])
    })

    this.RULE('object', function () {
      $.CONSUME(LCurly)
      $.MANY_SEP({
        SEP: Comma,
        DEF: function () {
          $.SUBRULE2($.objectItem)
        }
      })
      $.CONSUME(RCurly)
    })

    this.RULE('objectItem', function () {
      $.CONSUME(StringLiteral)
      $.CONSUME(Colon)
      $.SUBRULE($.value)
    })

    this.RULE('array', function () {
      $.CONSUME(LSquare)
      $.MANY_SEP({
        SEP: Comma,
        DEF: function () {
          $.SUBRULE2($.value)
        }
      })
      $.CONSUME(RSquare)
    })

    this.RULE('value', function () {
      // prettier-ignore
      $.OR([
        { ALT: function () { $.CONSUME(StringLiteral) } },
        { ALT: function () { $.CONSUME(NumberLiteral) } },
        { ALT: function () { $.SUBRULE($.object) } },
        { ALT: function () { $.SUBRULE($.array) } },
        { ALT: function () { $.CONSUME(True) } },
        { ALT: function () { $.CONSUME(False) } },
        { ALT: function () { $.CONSUME(Null) } }
      ])
    })

    // very important to call this after all the rules have been defined.
    // otherwise the parser may not work correctly as it will lack information
    // derived during the self analysis phase.
    this.performSelfAnalysis()
  }
}

// ----------------- wrapping it all together -----------------

// reuse the same parser instance.
const parser = new JsonParserES5()

module.exports = function (text) {
  const lexResult = JsonLexer.tokenize(text)

  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens

  // any top level rule may be used as an entry point
  const cst = parser.json()

  return {
    cst,
    lexErrors: lexResult.errors,
    parseErrors: parser.errors
  }
}

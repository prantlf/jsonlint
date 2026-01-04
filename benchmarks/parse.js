const createSuite = require('./common/createSuite')

const chevrotainParse = require('./chevrotain/pure')
const chevrotainExtendedParse = require('./chevrotain/extended')
const { parse: pegjsParse } = require('./pegjs/pure')
const { parse: pegjsExtendedParse } = require('./pegjs/extended')
const { Parser: JisonParser } = require('./jison/pure').parser
const { Parser: JisonExtendedParser } = require('./jison/extended').parser
const { parse: jjuPureParse } = require('./jju/pure')
const { parse: jjuExtendedParse } = require('./jju/extended')
const { parse: jjuTokenisingParse } = require('./jju/tokenizing')
const jisonParser = new JisonParser()
const jisonExtendedParser = new JisonExtendedParser()
const handbuiltParse = require('./hand-built/pure')
const handbuiltExtendedParse = require('./hand-built/pure')
const astParse = require('json-to-ast')
const JSON5 = require('json5')
const JSON6 = require('json-6')
const { parse: parseWithComments } = require('comment-json')
const { parse: parseThis, tokenize: tokenizeThis } = require('..')
const myna = require('myna-parser')
require('./myna/pure')(myna)
const mynaParse = myna.parsers.json
const { Parser: NearleyParser, Grammar: NearleyGrammar } = require('nearley')
const nearleyJsonGrammar = require('./nearley/pure')
const nearleyParser = new NearleyParser(NearleyGrammar.fromCompiled(nearleyJsonGrammar))
const nearleyOrigin = nearleyParser.save()
const { parse: parseMomoa } = require("@humanwhocodes/momoa");
const parseJson = require("./ryan-grove/pure");

const pkg = require('../package')
const input = JSON.stringify(pkg, undefined, 2)

function parseBuiltIn () {
  JSON.parse(input)
}

function parsePureChevrotain () {
  chevrotainParse(input)
}

function parseExtendedChevrotain () {
  chevrotainExtendedParse(input)
}

function parseHandbuilt () {
  handbuiltParse(input)
}

function parseExtendedHandbuilt () {
  handbuiltExtendedParse(input)
}

function parsePureJju () {
  jjuPureParse(input)
}

function parseExtendedJju () {
  jjuExtendedParse(input, { json5: true })
}

function parseTokenisableJju () {
  jjuTokenisingParse(input, { json5: true })
}

function parseTokenisingJju () {
  jjuTokenisingParse(input, {
    tokenize: true,
    json5: true
  })
}

function parseCommentJson () {
  parseWithComments(input)
}

function parseCurrentStandard () {
  parseThis(input)
}

function parseCurrentExtended () {
  parseThis(input, { mode: 'json5' })
}

function parseCurrentTokenising () {
  tokenizeThis(input, { mode: 'json5' })
}

function parseNearley () {
  nearleyParser.restore(nearleyOrigin)
  nearleyParser.feed(input)
}

function parsePurePegjs () {
  pegjsParse(input)
}

function parseExtendedPegjs () {
  pegjsExtendedParse(input)
}

function parsePureJison () {
  jisonParser.parse(input)
}

function parseExtendedJison () {
  jisonExtendedParser.parse(input)
}

function parseJSON5 () {
  JSON5.parse(input)
}

function parseJSON6 () {
  JSON6.parse(input)
}

function parseAST () {
  astParse(input, {
    loc: true
  })
}

function parseMyna () {
  mynaParse(input)
}

function parseMomoaStandard () {
  parseMomoa(input)
}

function parseMomoaExtended () {
  parseMomoa(input, { mode: 'json5' })
}

function parseRyanGrove () {
  parseJson(input)
}

createSuite(`Parsing JSON data ${input.length} characters long using`)
  .add('the built-in parser', parseBuiltIn)
  .add('the pure chevrotain parser', parsePureChevrotain)
  .add('the extended chevrotain parser', parseExtendedChevrotain)
  .add('the standard jsonlint parser', parseCurrentStandard)
  .add('the extended jsonlint parser', parseCurrentExtended)
  .add('the tokenising jsonlint parser', parseCurrentTokenising)
  .add('the pure hand-built parser', parseHandbuilt)
  .add('the extended hand-built parser', parseExtendedHandbuilt)
  .add('the AST parser', parseAST)
  .add('the Myna parser', parseMyna)
  .add('the pure jju parser', parsePureJju)
  .add('the extended jju parser', parseExtendedJju)
  .add('the tokenisable jju parser', parseTokenisableJju)
  .add('the tokenising jju parser', parseTokenisingJju)
  .add('the comments-enabled parser', parseCommentJson)
  .add('the pure pegjs parser', parsePurePegjs)
  .add('the extended pegjs parser', parseExtendedPegjs)
  .add('the pure jison parser', parsePureJison)
  .add('the extended jison parser', parseExtendedJison)
  .add('the JSON5 parser', parseJSON5)
  .add('the JSON6 parser', parseJSON6)
  .add('the Nearley parser', parseNearley)
  .add('the standard Momoa parser', parseMomoaStandard)
  .add('the extended Momoa parser', parseMomoaExtended)
  .add('the Ryan Grove parser', parseRyanGrove)
  .start()

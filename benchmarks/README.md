# JSON Parser Comparison

This project compares the [performance] of JSON parsers and the [quality of error reporting] if an invalid input is encountered with intention to select [the best parsers for particular scenarios].

## Installation

Install additional NPM modules for the benchmarks and generate JSON parsers from grammars:

    npm ci

## Testing

Run [performance tests] to compare the parsing speed:

    node parse

Compare error handling by [testing invalid input] and printing various error messages:

    node fail

If you modify some grammars, you have to regenerate parsers before running the tests again:

    npm run prepare

## Performance

    ❯ node parse
    Parsing JSON data 4412 characters long using:
      the built-in parser x 106,451 ops/sec ±0.76% (88 runs sampled)
      the pure chevrotain parser x 12,601 ops/sec ±0.96% (89 runs sampled)
      the extended chevrotain parser x 11,923 ops/sec ±1.08% (85 runs sampled)
      the standard jsonlint parser x 107,059 ops/sec ±0.48% (91 runs sampled)
      the extended jsonlint parser x 14,295 ops/sec ±1.02% (88 runs sampled)
      the tokenising jsonlint parser x 12,355 ops/sec ±0.62% (91 runs sampled)
      the pure hand-built parser x 14,610 ops/sec ±0.80% (90 runs sampled)
      the extended hand-built parser x 14,487 ops/sec ±0.84% (92 runs sampled)
      the AST parser x 11,670 ops/sec ±0.73% (87 runs sampled)
      the Myna parser x 3,401 ops/sec ±0.56% (89 runs sampled)
      the pure jju parser x 13,733 ops/sec ±0.49% (92 runs sampled)
      the extended jju parser x 13,586 ops/sec ±1.17% (89 runs sampled)
      the tokenisable jju parser x 11,041 ops/sec ±0.76% (90 runs sampled)
      the tokenising jju parser x 8,248 ops/sec ±0.76% (91 runs sampled)
      the comments-enabled parser x 7,374 ops/sec ±1.05% (88 runs sampled)
      the pure pegjs parser x 3,088 ops/sec ±0.69% (90 runs sampled)
      the extended pegjs parser x 2,756 ops/sec ±0.79% (91 runs sampled)
      the pure jison parser x 2,472 ops/sec ±0.60% (90 runs sampled)
      the extended jison parser x 2,174 ops/sec ±1.89% (87 runs sampled)
      the JSON5 parser x 2,098 ops/sec ±2.17% (87 runs sampled)
      the JSON6 parser x 10,965 ops/sec ±0.57% (88 runs sampled)
      the Nearley parser x 1,311 ops/sec ±1.20% (86 runs sampled)
      the standard Momoa parser x 9,697 ops/sec ±0.61% (92 runs sampled)
      the extended Momoa parser x 8,753 ops/sec ±0.68% (90 runs sampled)
      the Ryan Grove parser x 16,936 ops/sec ±0.64% (89 runs sampled)
    The fastest one was the standard jsonlint parser,the built-in parser.

[performance]: ./results/performance.md
[quality of error reporting]: ./results/errorReportingQuality.md
[the best parsers for particular scenarios]: ./results/evaluation.md
[performance tests]: ./parse.js
[testing invalid input]: ./fail.js

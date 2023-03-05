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
    Parsing JSON data 4797 characters long using:
      the built-in parser x 78,856 ops/sec ±0.50% (92 runs sampled)
      the pure chevrotain parser x 9,815 ops/sec ±1.29% (90 runs sampled)
      the extended chevrotain parser x 9,512 ops/sec ±0.90% (92 runs sampled)
      the standard jsonlint parser x 78,998 ops/sec ±0.48% (95 runs sampled)
      the extended jsonlint parser x 7,923 ops/sec ±0.51% (93 runs sampled)
      the tokenising jsonlint parser x 6,281 ops/sec ±0.71% (91 runs sampled)
      the pure hand-built parser x 13,529 ops/sec ±0.62% (92 runs sampled)
      the extended hand-built parser x 13,475 ops/sec ±0.81% (92 runs sampled)
      the AST parser x 9,201 ops/sec ±0.74% (91 runs sampled)
      the Myna parser x 3,089 ops/sec ±0.54% (94 runs sampled)
      the pure jju parser x 8,596 ops/sec ±0.98% (92 runs sampled)
      the extended jju parser x 6,966 ops/sec ±0.59% (89 runs sampled)
      the tokenisable jju parser x 6,091 ops/sec ±0.84% (89 runs sampled)
      the tokenising jju parser x 4,651 ops/sec ±0.54% (92 runs sampled)
      the comments-enabled parser x 5,632 ops/sec ±0.65% (92 runs sampled)
      the pure pegjs parser x 2,413 ops/sec ±0.69% (92 runs sampled)
      the extended pegjs parser x 2,124 ops/sec ±0.66% (92 runs sampled)
      the pure jison parser x 1,722 ops/sec ±1.16% (88 runs sampled)
      the extended jison parser x 1,619 ops/sec ±0.65% (91 runs sampled)
      the JSON5 parser x 1,283 ops/sec ±0.43% (91 runs sampled)
      the JSON6 parser x 7,922 ops/sec ±1.78% (92 runs sampled)
      the Nearley parser x 944 ops/sec ±0.51% (92 runs sampled)
    The fastest one were the standard jsonlint parser and the built-in parser.

[performance]: ./results/performance.md
[quality of error reporting]: ./results/errorReportingQuality.md
[the best parsers for particular scenarios]: ./results/evaluation.md
[performance tests]: ./parse.js
[testing invalid input]: ./fail.js

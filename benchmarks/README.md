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
    Parsing JSON data 4868 characters long using:
      the built-in parser x 51,485 ops/sec ±7.66% (58 runs sampled)
      the pure chevrotain parser x 6,445 ops/sec ±9.27% (52 runs sampled)
      the extended chevrotain parser x 6,802 ops/sec ±8.64% (63 runs sampled)
      the standard jsonlint parser x 56,024 ops/sec ±8.26% (66 runs sampled)
      the extended jsonlint parser x 5,664 ops/sec ±9.85% (64 runs sampled)
      the tokenising jsonlint parser x 5,086 ops/sec ±8.54% (65 runs sampled)
      the pure hand-built parser x 9,260 ops/sec ±8.53% (67 runs sampled)
      the extended hand-built parser x 8,965 ops/sec ±8.46% (66 runs sampled)
      the AST parser x 6,226 ops/sec ±7.87% (85 runs sampled)
      the Myna parser x 1,784 ops/sec ±7.12% (81 runs sampled)
      the pure jju parser x 5,047 ops/sec ±8.06% (72 runs sampled)
      the extended jju parser x 4,966 ops/sec ±7.73% (73 runs sampled)
      the tokenisable jju parser x 4,287 ops/sec ±8.43% (65 runs sampled)
      the tokenising jju parser x 3,378 ops/sec ±8.30% (65 runs sampled)
      the comments-enabled parser x 4,101 ops/sec ±9.01% (65 runs sampled)
      the pure pegjs parser x 1,628 ops/sec ±8.18% (59 runs sampled)
      the extended pegjs parser x 1,611 ops/sec ±9.66% (63 runs sampled)
      the pure jison parser x 1,283 ops/sec ±9.04% (57 runs sampled)
      the extended jison parser x 1,186 ops/sec ±8.65% (58 runs sampled)
      the JSON5 parser x 953 ops/sec ±8.71% (68 runs sampled)
      the Nearley parser x 663 ops/sec ±8.44% (59 runs sampled)
    The fastest one was the standard jsonlint parser.


[performance]: ./results/performance.md
[quality of error reporting]: ./results/errorReportingQuality.md
[the best parsers for particular scenarios]: ./results/evaluation.md
[performance tests]: ./parse.js
[testing invalid input]: ./fail.js

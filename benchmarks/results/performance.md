Performance of JSON Parsers
===========================

I looked at some parsers, which were [tested with a JSON grammar]. The benchmark was written by the team behind Chevrotain. There might be some optimisations in other parsers possible, but the code should be enough to get a rough overview and also to compare the [quality of error reporting].

I modified the grammars to support extensions to the JSON format, which may be helpful, if you use JSON not only for machine-generated data exchange, but also for hand-edited files, like configuration. I named the original grammars `pure` and the modified ones `extended`. The extensions were:

* Ignoring JavaScript-like single-line and multiple-line comments. Useful for documenting configuration files.
* Accepting single quotes (apostrophes) as string delimiters. Useful for input files using them to avoid escaping of quotation marks.

Code Size
---------

The size of the JavaScript code is important, when the application runs in the web browser.

| File                   | Source    | Minified  | Gzipped  | Brotlied |
| :--------------------- | --------: | --------: | -------: | -------: |
| hand-built/extended.js |   6.04 kB |   1.82 kB |   819  B |   738  B |
| jison/extended.js      |  24.50 kB |  10.90 kB |  3.85 kB |  3.46 kB |
| jju/extended.js        |  27.50 kB |  15.10 kB |  5.16 kB |  3.95 kB |
| pegjs/extended.js      |  52.20 kB |  12.60 kB |  3.39 kB |  2.90 kB |
| json5/dist/index.js    |  58.60 kB |  31.30 kB |  9.26 kB |  7.17 kB |
| json6/dist/index.js    |  77.70 kB |  19.10 kB |  6.92 kB |  6.31 kB |
| chevrotain/extended.js | 568.24 kB | 224.70 kB | 51.70 kB | 43.70 kB |

Results
-------

This is a result of the [benchmark] run by `node parse`. The numbers should be understood as relative ones:

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

I looked further at capabilities and licenses of the parsers.

[Built-in]
----------

* The plain `JSON.parse`, run just with the input string and no reviver.
* The fastest one, of course, but not adaptable.

[Chevrotain]
------------

* Does not generate code from tokens and grammar; uses a coded grammar.
* The fastest one with an adaptable code base.
* Supports a limited recovery to be able to continue parsing after an error occurs.
* Can report all errors that occur in the whole input.
* Differs between lexical and parsing errors.
* The license (Apache 2) is not compatible with JSONLint.

[Hand-built]
------------

* A code example from Chevrotain benchmarks.
* Very fast one.
* Error reporting would need to be improved.
* The license (Apache 2) is not compatible with JSONLint.

[AST]
-----

* Very fast one.
* Generates an AST to analyse the JSON input.
* Does not return JSON data without an additional generator using the AST.

[JJU]
-----

* A part of other utilities to work with JSON/JSON5 documents.
* Very fast one.
* Supports `reviver` for the full compatibility with JSON.parse.
* Can generate tokens to analyse, modify and update the original JSON input.

[comment-json]
--------------

* Very fast one.
* Supports `reviver` for the full compatibility with JSON.parse.
* Supports CJSON - JSON with JavaScript-like comments.

[PEG.JS]
--------

* Uses [PEG] to generate the parser code.
* Still fast, for a generated parser code.

[Jison]
-------

* Accepts grammar in the format of the [Bison] parser generator.
* Used in the [original JSONLint].
* Slower one.

[JSON5]
-------

* Hand-built parser implementing the [JSON6 specification]. Extensions mentioned above were included, and even more, like trailing commas or multi-line strings. No support for pure JSON.
* Slower one.

[JSON6]
-------

* Hand-built parser going beyond the [JSON5 specification]. Extensions mentioned above were included, and even more, like trailing commas or multi-line strings. No support for pure JSON.
* Very fast one.

[Ryan Grove]
------------

* Personal fun project.
* Very fast one.

[JSONLint]
----------

This entry is here just to compare the current implementation to the original "contenders". Based on the [evaluation] results, the current JSONLint uses a hand-coded parser based on [JJU]. THe [JSON6] parser wasn't available at that time, otherwise it would've been a serious candidate.

[tested with a JSON grammar]: https://sap.github.io/chevrotain/performance/
[quality of error reporting]: ./errorReportingQuality.md
[evaluation]: ./evaluation.md
[benchmark]: ../parse.js
[Built-in]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
[Chevrotain]: https://github.com/SAP/chevrotain
[Hand-built]: https://github.com/sap/chevrotain/blob/gh-pages/performance/jsonParsers/handbuilt/handbuilt.js
[JJU]: http://rlidwka.github.io/jju/
[comment-json]: https://github.com/kaelzhang/node-comment-json
[AST]: https://github.com/vtrushin/json-to-ast
[PEG.JS]: http://pegjs.org/
[Jison]: http://zaach.github.io/jison/
[JSON5]: https://json5.org/
[JSON6]: https://github.com/d3x0r/JSON6#readme
[PEG]: https://en.wikipedia.org/wiki/Parsing_expression_grammar
[Bison]: https://en.wikipedia.org/wiki/GNU_Bison
[JSON5 specification]: https://spec.json5.org/
[original JSONLint]: https://github.com/zaach/jison
[Ryan Grove]: https://gist.github.com/rgrove/5cc64db4b9ae8c946401b230ba9d2451

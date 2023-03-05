Evaluation of JSON Parsers
===========================

I looked at some parsers, which were [tested with a JSON grammar]. Although the [performance] comparison shows a clear winner and a very capable runner-up, JSONLint is primarily a tool to validate the input and that is why the [quality of error reporting] is very important too.

The best parser is likely to be chosen specifically for the particular usage scenario. A universal parser will need accepting some compromises.

Universal Parser
----------------

The most understandable messages are reported by [JJU] and [PEG.js]. The performance of the latter is not on par with the fastest parsers, but other parsers generated from a grammar specification are even slower. [JSON6] contains the extended information, but appended to the error message, which can make it longer and not so easy to read. 

Validate Standard JSON As Fast As Possible
------------------------------------------

The [built-in] native JSON parser (`JSON.parse`) offers by far the best performance. If the error message is enriched by additional information, which is feasible, it lacks nothing. The message might bee seen short, but it is understandable very well.

Validate Non-Standard JSON
--------------------------

Depending on extra features required, [Chevrotain], [JJU] and [JSON6] offer the best quality/performance ratio. Chevrotain tries harder to explain, what was wrong, which is often quite counterproductive. JJU explains the problems well-enough with a single sentence, even ended by a full-stop. Chevrotain packs additional features like recovery and reporting all errors instead of just the first one. This extra feature might make it a winner for a flexibly configurable scenario. However, the Chevrotain parser needs significantly more code, than all the others. JSON6 supports many extensions to JSON/JSON5 standards.

[tested with a JSON grammar]: https://sap.github.io/chevrotain/performance/
[performance]: ./performance.md
[quality of error reporting]: ./errorReportingQuality.md
[built-in]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
[Chevrotain]: https://github.com/SAP/chevrotain
[JJU]: http://rlidwka.github.io/jju/
[PEG.JS]: http://pegjs.org/
[JSON6]: https://github.com/d3x0r/JSON6#readme

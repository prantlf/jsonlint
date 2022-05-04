# [11.6.0](https://github.com/prantlf/jsonlint/compare/v11.5.0...v11.6.0) (2022-05-04)


### Bug Fixes

* Do not generate text diff if not needed ([0423a4b](https://github.com/prantlf/jsonlint/commit/0423a4b1fbc10cb6a201fe79e29a2b0e0101f3d0))


### Features

* Allow setting the line count as diff context ([9b22843](https://github.com/prantlf/jsonlint/commit/9b22843a93ec47c0e18b1833618072083989b431))

# [11.5.0](https://github.com/prantlf/jsonlint/compare/v11.4.0...v11.5.0) (2022-05-03)


### Bug Fixes

* Do not print file names twice in the compact mode ([86691cc](https://github.com/prantlf/jsonlint/commit/86691cc5fea760a437cae5aff71f0acc987c4e05))


### Features

* Add option "diff" to print the difference instead of the output ([cb3826c](https://github.com/prantlf/jsonlint/commit/cb3826c7610aae8d23623da3693e45cbf942223e))

# [11.4.0](https://github.com/prantlf/jsonlint/compare/v11.3.0...v11.4.0) (2022-05-03)


### Features

* Introduce a check that the formatted output is the same as the input ([75167f7](https://github.com/prantlf/jsonlint/commit/75167f76c4bbd13551ca7e20824cc05095fc6be0))

# [11.3.0](https://github.com/prantlf/jsonlint/compare/v11.2.0...v11.3.0) (2022-05-03)


### Bug Fixes

* Fix the regex splitting input by line breaks ([7423806](https://github.com/prantlf/jsonlint/commit/74238065643d31044990801713410041cdbb55f0))


### Features

* Read options from configuration files ([7eebd76](https://github.com/prantlf/jsonlint/commit/7eebd765f66bcd3bcd6cde7d9c128cbacaca1285))

# [11.2.0](https://github.com/prantlf/jsonlint/compare/v11.1.1...v11.2.0) (2022-05-01)


### Features

* Allow logging only the name of processed files ([91346d9](https://github.com/prantlf/jsonlint/commit/91346d95459f5b516ae71233050262534f197fbf))
* Allow to continue processing in case of error ([e5318eb](https://github.com/prantlf/jsonlint/commit/e5318ebb75f90459ff4164ec6e84efcc34a9bf4c))
* Support BASH patterns to specify input files ([31d162f](https://github.com/prantlf/jsonlint/commit/31d162fa9578bd6888d01c3cd0175960b5740d86))

## [11.1.1](https://github.com/prantlf/jsonlint/compare/v11.1.0...v11.1.1) (2022-05-01)


### Bug Fixes

* Retain the original last line break in the processed file ([54fd5ab](https://github.com/prantlf/jsonlint/commit/54fd5ab0349300c7bd11dfa6baf4e787e40bead9))

# [11.1.0](https://github.com/prantlf/jsonlint/compare/v11.0.0...v11.1.0) (2022-05-01)

### Bug Fixes

* Merge remote-tracking branch 'xmedeko/patch-1' ([da3e1dc](https://github.com/prantlf/jsonlint/commit/da3e1dca6ce6efcd8d5bd775d75bad06d8c46223))

### Features

* Optionally ensure a line break at the end of the output ([226019e](https://github.com/prantlf/jsonlint/commit/226019eb75c675eab1dca817ff0dc42e0223d197))

# [11.0.0](https://github.com/prantlf/jsonlint/compare/v10.2.0...v11.0.0) (2022-05-01)

### Bug Fixes

* Upgrade dependencies ([0d35969](https://github.com/prantlf/jsonlint/commit/0d359690aa19884a6d17990c476cf780b39663c0))

### BREAKING CHANGES

* The minimum supported version has become Node.js 12 instead of the previous Node.js 6. At least `commander` needs the new version.

# [10.2.0](https://github.com/prantlf/jsonlint/compare/v10.1.1...v10.2.0) (2019-12-28)

### Features

* Allow trimming trailing commas in arrays and objects (JSON5) ([136ea99](https://github.com/prantlf/jsonlint/commit/136ea995bef7b0f77c2ac54b6ce7dd8572190bf8))
* Allow unifying quotes around object keys to double or single ones (JSON5) ([6b6da17](https://github.com/prantlf/jsonlint/commit/6b6da175cfea8f71841e145a525ef124c19c2607))

# [10.1.1](https://github.com/prantlf/jsonlint/compare/v10.1.0...v10.1.1) (2019-12-27)

### Bug Fixes

* Restore compatibility with IE11 ([55b8a48](https://github.com/prantlf/jsonlint/commit/55b8a4816b08c5504cf7f0841d1997634a6376ea))

# [10.1.0](https://github.com/prantlf/jsonlint/compare/v10.0.2...v10.1.0) (2019-12-27)

### Features

* Alternatively accept number of spaces for the indent parameter ([4c25739](https://github.com/prantlf/jsonlint/commit/4c257399b77e446c198b25049fae2ca08ad174ec))

# [10.0.2](https://github.com/prantlf/jsonlint/compare/v10.0.1...v10.0.2) (2019-12-27)

### Bug Fixes

* Do not modify input options in the tokenize method ([7e3ac0b](https://github.com/prantlf/jsonlint/commit/7e3ac0babf873c42da1daadaee2bbe55d2644690))

# [10.0.1](https://github.com/prantlf/jsonlint/compare/v10.0.0...v10.0.1) (2019-12-27)

### Bug Fixes

* Pretty-printer: keep the comment after opening an object scope indented ([4fbc09d](https://github.com/prantlf/jsonlint/commit/4fbc09d402ed5442e2de77382342267e330cb908))

# [10.0.0](https://github.com/prantlf/jsonlint/compare/v9.0.0...v10.0.0) (2019-12-27)

### Bug Fixes

* Rename the property "exzerpt" in error information to "excerpt" ([4c74e3d](https://github.com/prantlf/jsonlint/commit/4c74e3d866fc54a7b2f833ff522efbaef3331bbe))

### Features

* Add support for pretty-printing of the JSON input ([d5eaa93](https://github.com/prantlf/jsonlint/commit/d5eaa9350d654050316b186dc8965ce9cb45d905))

### BREAKING CHANGES

* If you used the property "exzerpt" from the parsing error object, you have to change it to "excerpt". It should be easy using a full-text search in your sources.
* The option for pretty-printing *invalid input* has been renamed:

    -p (--pretty-print) ==> -P (--pretty-print-invalid)

The option `-p (--pretty-print)` will newly prettify the raw (text) input instead of formatting the parsed JSON object.

# [9.0.0](https://github.com/prantlf/jsonlint/compare/v8.0.3...v9.0.0) (2019-12-22)

### chore

* Upgrade package dependencies ([4a8f2d9](https://github.com/prantlf/jsonlint/commit/4a8f2d9c27428da32b95f607bf7952190636af9f))

### Features

* Add TypeScript typings ([ba6c979](https://github.com/prantlf/jsonlint/commit/ba6c9790792837fdc3abd0032899ffd04953cf3d))

### BREAKING CHANGES

* Dependencies (commander, at least) dropped support for Node.js 4. Node.js 6 should still work, but officially it is not supported either. You should upgrade to the current or still supported Node.js LTS version.

## [8.0.3](https://github.com/prantlf/jsonlint/compare/v8.0.2...v8.0.3) (2019-09-24)

### Bug Fixes

* Upgrade package dependencies and adapt sources ([9f1f332](https://github.com/prantlf/jsonlint/commit/9f1f332960c91d9779bff995457154157df8823b))

## [8.0.2](https://github.com/prantlf/jsonlint/compare/v8.0.1...v8.0.2) (2019-07-04)

### Bug Fixes

* Put only the reason of the error to the error.reason property when the custom parser is used; not the full message including the error context ([8d7f0b1](https://github.com/prantlf/jsonlint/commit/8d7f0b13b2bfe7e854c965b7266e5de1dec79229))
* Update newline replacement regex to show correct error position on Windows ([7af364c](https://github.com/prantlf/jsonlint/commit/7af364cbafd84326f20f29adbacde1cd0f70e57a))

# [8.0.0](https://github.com/prantlf/jsonlint/compare/v7.0.3...v8.0.0) (2019-06-16)

### Bug Fixes

* Give the schema-drafts.js proper name and path in source maps ([c2f0148](https://github.com/prantlf/jsonlint/commit/c2f0148cb027e335fa2bb644f3c09a9c51303193))

### Features

* Add the tokenize method returning tokens instead of the parsed object ([cc7b554](https://github.com/prantlf/jsonlint/commit/cc7b55495b3287279aa0c27e242d3e90d8636d66))
* Improve schema error reporting to the level of data parsing ([ea5a8a2](https://github.com/prantlf/jsonlint/commit/ea5a8a2f917f6a07212f8a4e05af22c14e5f1883))
* Remove deprecated exports `Parser` and `parser` ([8bda5b1](https://github.com/prantlf/jsonlint/commit/8bda5b1455d8d176997dcce0bbcd622985888fc7))

### BREAKING CHANGES

* The `Parser` class and `parser` instance did not bring any benefit. They were generated by Jison. After abandoning the Jison parser they were kept for compatibility only. The only method on the `Parser` prototype was the `parse`. It remains unchanged as a direct export. Drop the class interface and just call the `parse` method directly.

## [7.0.3](https://github.com/prantlf/jsonlint/compare/v7.0.2...v7.0.3) (2019-06-03)

### Bug Fixes

* Ensure, that tokens and keys in error messages are enclosed in quotation marks ([2149198](https://github.com/prantlf/jsonlint/commit/2149198721fc8dd05632b2225c621ebf7b5e14b7))

## [7.0.2](https://github.com/prantlf/jsonlint/compare/v7.0.1...v7.0.2) (2019-06-02)

### Bug Fixes

* Upgrade minificating module ([04d80d7](https://github.com/prantlf/jsonlint/commit/04d80d752c4900f26585d9a809b8ac6d0eef696d))

## [7.0.1](https://github.com/prantlf/jsonlint/compare/v7.0.0...v7.0.1) (2019-06-02)

### Bug Fixes

* Recognize boxed string as schema environment too ([e37b004](https://github.com/prantlf/jsonlint/commit/e37b0042376cf5beafc93bf906ee70b583f08969))

# [7.0.0](https://github.com/prantlf/jsonlint/compare/v6.3.1...v7.0.0) (2019-06-02)

### Bug Fixes

* Do not use the native parser in Safari and Node.js 4 ([a4a606c](https://github.com/prantlf/jsonlint/commit/a4a606c333e443642ced99d466223607bce11461))
* Include the minified scripts used on the on-line page in the NPM module ([03561ec](https://github.com/prantlf/jsonlint/commit/03561ecba00c5d23dfba41831bea818837a7b804))

### Features

* Add "mode" parameter to set flags for a typical format type easier ([9aa09fb](https://github.com/prantlf/jsonlint/commit/9aa09fbc9980e78fa0fed134ce48d99412b619a9))
* Add an option for ignoring trailing commas in object and arrays ([7d521fb](https://github.com/prantlf/jsonlint/commit/7d521fb68ea7919625cc6bc5f5179ce69f6b5985))
* Add an option for reporting duplicate object keys as an error ([09e3977](https://github.com/prantlf/jsonlint/commit/09e39772de088b73e43dac551533a160bc09903c))
* Replace the parser generated by Jison with a hand-built parser from JJU ([2781670](https://github.com/prantlf/jsonlint/commit/27816706435fb48fb8816d743bc56d6d34c4c6c8))
* Support `reviver` from the native `JSON.parse` method ([83cd33c](https://github.com/prantlf/jsonlint/commit/83cd33c937851482799e01bf7262a9ba93bed6cf))

### BREAKING CHANGES

* There is no `yy.parseError` to intercept error handling. Use the thrown error - it contains all available information. The error does not include the `hash` object with structured information. Look for the [documentd properties](/prantlf/jsonlint#error-handling). The location of the error occurrence is available as `location.start`, for example.

DEPRECATION: The only exposed object to use from now on is the `parse` method as a named export. Other exports (`parser` and `Parser`) are deprecated and will be removed in future.

The parser from ["Utilities to work with JSON/JSON5 documents"](/rlidwka/jju) is four times faster, than the previous one, has approximatly the same size and can be easier enhanced, regarding both features and error handling.

## [6.3.1](https://github.com/prantlf/jsonlint/compare/v6.3.0...v6.3.1) (2019-05-31)

### Bug Fixes

* Recognise the location of error occurrences in Firefox ([7c8c040](https://github.com/prantlf/jsonlint/commit/7c8c040e8f9d259bf573c04f8f6a7df15587a54a))

# [6.3.0](https://github.com/prantlf/jsonlint/compare/v6.2.1...v6.3.0) (2019-05-30)

### Bug Fixes

* Auto-detect the version of the JSON Schema draft by default ([1fe98ef](https://github.com/prantlf/jsonlint/commit/1fe98ef4e3ee5cd26055e6f73f11387635a078a3))
* Prefer the native JSON parser, if possible, to improve performance ([1639356](https://github.com/prantlf/jsonlint/commit/16393562769a9f77741347fd9cda15c5207f1fee))

### Features

* Support parser options for customisation and performance in JSON schema parsing too ([d562826](https://github.com/prantlf/jsonlint/commit/d562826f604f8c3df5656a79ee4c2085c203f91c))

## [6.2.1](https://github.com/prantlf/jsonlint/compare/v6.2.0...v6.2.1) (2019-05-30)

### Bug Fixes

* Include source code in source maps on the on-line validator page ([31e0097](https://github.com/prantlf/jsonlint/commit/31e0097de3c2c5a30e3695d1d5b3f411dc7b6723))

# [6.2.0](https://github.com/prantlf/jsonlint/compare/v6.1.0...v6.2.0) (2019-05-30)

### Features

* Extract the functionality for sorting object keys to a module ([a53bd93](https://github.com/prantlf/jsonlint/commit/a53bd9392b2116b5272c77deee9423ba16b5f520))

# [6.1.0](https://github.com/prantlf/jsonlint/compare/v6.0.0...v6.1.0) (2019-05-27)

### Bug Fixes

* Fix the missing function object (Parser) in the main module exports ([eb892aa](https://github.com/prantlf/jsonlint/commit/eb892aab516754ec3bf2eb01ff575fe0c173a510))
* Restore context options (yy) set in the Parser constructor after the call to parse, if the options were overridden by the method arguments ([787c350](https://github.com/prantlf/jsonlint/commit/787c350c201ac0971e42d5b9f224689600e5c11f))

### Features

* Use the native JSON parser if a limited error information is enough ([8aa9fb1](https://github.com/prantlf/jsonlint/commit/8aa9fb10d6c6f7f148d8c7816cc73d6b8385aace))

# [6.0.0](https://github.com/prantlf/jsonlint/compare/v5.0.0...v6.0.0) (2019-05-26)

### Features

* Declare modules in this package using UMD ([d442583](https://github.com/prantlf/jsonlint/commit/d4425837cea5c11352f988e3723455b8d8f5115b))
* Remove ParserWithComments and parseWithComment from the interface ([3fab374](https://github.com/prantlf/jsonlint/commit/3fab374a0675a699dab3e8aed3bcf928b77fffe4))

### BREAKING CHANGES

* The object and the method do not exist any more. Pass the parameter "ignoreComments" as an object `{ ignoreComments: true }` either to the constructor of the `Parser` object, or as the second parameter to the method `parse`.

# [5.0.0](https://github.com/prantlf/jsonlint/compare/v4.0.2...v5.0.0) (2019-05-26)

### Bug Fixes

* Do not export "main" method, which requires other NPM modules ([d8af36a](https://github.com/prantlf/jsonlint/commit/d8af36ac292c68b0ee35460a5e7394a26fad4524))

### Features

* Accept single quotes (apostrophes) as string delimiters ([240b8cd](https://github.com/prantlf/jsonlint/commit/240b8cd916b7424e27f7ff585ca30512e87a6566))

### BREAKING CHANGES

* The "main" method providing a command-line interface importable from other module has been removed. If you used it, have a look at the command-line interface in `lib/cli`. You can import this module in instead and it offers a richer interface, than the previously exported "main" method. The `lib/cli` module is mapped to `bin/jsonlint` too. However, consider the default library export (`lib/jsonlint`) for programmatic usage. You will pack less JavaScript code and use smalker, mode programmer-oriented interface.

## [4.0.2](https://github.com/prantlf/jsonlint/compare/v4.0.1...v4.0.2) (2019-05-19)

### Bug Fixes

* Print parsing errors if the JSON input is read from stdin ([acfdf11](https://github.com/prantlf/jsonlint/commit/acfdf11e11a8f355cdd8fd1abf09edde664d8c02))

## [4.0.1](https://github.com/prantlf/jsonlint/compare/v4.0.0...v4.0.1) (2019-05-19)

### Bug Fixes

* Do not fail sorting objects with a property called "hasOwnProperty" ([b544ceb](https://github.com/prantlf/jsonlint/commit/b544ceb54d44e8273dd7a1d28fc7f69a527fd806))

# [4.0.0](https://github.com/prantlf/jsonlint/compare/v3.0.0...v4.0.0) (2019-05-19)

### Bug Fixes

* Standardize the interface of the "jsonlint/lib/formatter" module ([b8b041b](https://github.com/prantlf/jsonlint/commit/b8b041bcc0e6ea672ec4575c5b108f347cfef69a))

### Features

* Add web and programmatic interfaces to JSON Schema validation ([d45b243](https://github.com/prantlf/jsonlint/commit/d45b243bf1d083df58d9959d42eb3a787f5e7d89))

### BREAKING CHANGES

* The formatting method is exposed not as exports.formatter.formatJson, but as exports.format.
This module is not documented and it is unlikely, that it broke other project.

# [3.0.0](https://github.com/prantlf/jsonlint/compare/v2.0.1...v3.0.0) (2019-05-18)

### Bug Fixes

* Replace JSON schema validator JSV with ajv, because JSV is not maintained any more and does not support current JSON schema drafts ([1a4864f](https://github.com/prantlf/jsonlint/commit/1a4864f63ba14cb86a4e677fc23e5c1e963d2e07))

### BREAKING CHANGES

* The environment for the JSON schema validation "json-schema-draft-03" is not available any more.
Migrate your schemas from the JSON schema draft 03 to 04 or newer. Drafts 04, 06 and 07 are supported with this release.

## [2.0.1](https://github.com/prantlf/jsonlint/compare/v2.0.0...v2.0.1) (2019-05-18)

### Bug Fixes

* Do not depend on the standard checker in the release package ([1e9c7b5](https://github.com/prantlf/jsonlint/commit/1e9c7b5b5c091332270dbe6b2203fd66644bf355))

# [2.0.0](https://github.com/prantlf/jsonlint/compare/v1.7.0...v2.0.0) (2019-05-18)

### Bug Fixes

* Accept any file extension on the command line directly ([14ba31c](https://github.com/prantlf/jsonlint/commit/14ba31cf5adc0ddb24d6c318866b6bf9a3c6ae48))
* Do not distribute the web directory in the npm module ([7379be8](https://github.com/prantlf/jsonlint/commit/7379be83e3dc511785c4506e8ab55b77e014724e))
* Make the compact-errors mode working with the latest Jison output ([d417a9c](https://github.com/prantlf/jsonlint/commit/d417a9c39047be929b9f7589da9c2d3c188db7f9))
* Rename the long name of the option "extension" to "extensions" ([383e50a](https://github.com/prantlf/jsonlint/commit/383e50a6a00ee4641f8ae863b46e1af7bade7ee9))
* Replace nomnom as command-line parser with commander, which is maintaitained ([6694bba](https://github.com/prantlf/jsonlint/commit/6694bba56fc821cbe2622340c9753506fa026580))
* Report the right file name in the compact-errors mode, if multiple files or directories are engtered ([7c80326](https://github.com/prantlf/jsonlint/commit/7c80326a69a8df8f1f7ea66dced4a888ea321d9b))

### Features

* Add a checkbox to recognize JavaScript-style comments to the web page ([2a9082a](https://github.com/prantlf/jsonlint/commit/2a9082a26d1316a80ebf132d159e5bf49c3d0978))
* Support parsing and skipping JavaScript-style comments in the JSON input ([4955c58](https://github.com/prantlf/jsonlint/commit/4955c58788dd3b8c3a7a4358cbf65af72a353d0d))

### BREAKING CHANGES

* The options "extension" is not recognized any more.
Use the option "extensions" with the same semantics instead.

# [1.7.0](https://github.com/prantlf/jsonlint/compare/v1.6.4...v1.7.0) (2019-05-18)

### Features

* Allow specifying JSON file extensions for directory walk ([d8e8076](https://github.com/prantlf/jsonlint/commit/d8e8076edb831a577f5e272a5ea9e4edd077671b))

This is the first version released after forking the [original project](https://github.com/zaach/jsonlint).

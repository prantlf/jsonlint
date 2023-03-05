(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    const jsonlint = require('./jsonlint')
    const ajv = {
      AjvOld: 'ajv6',
      Ajv07: 'ajv',
      AjvJTD: 'ajv/dist/jtd',
      Ajv2019: 'ajv/dist/2019',
      Ajv2020: 'ajv/dist/2020',
      Schema04: 'ajv6/lib/refs/json-schema-draft-04.json',
      Schema06: 'ajv/dist/refs/json-schema-draft-06.json'
    }
    const requireAjv = name => {
      const exported = require(ajv[name])
      return !exported.$schema && exported.default || exported
    }
    factory(exports, jsonlint, requireAjv)
  } else if (typeof define === 'function' && define.amd) {
    define('jsonlint-validator', ['exports', 'jsonlint', 'ajv', 'ajv7'],
      function (exports, jsonlint, ajv, ajv7) {
        const requireAjv = name => {
          if (name === 'AjvOld') return ajv
          const exported = ajv7[name]
          return !exported.$schema && exported.default || exported
        }
        factory(exports, jsonlint, requireAjv)
      })
  } else {
    global = global || self
    const requireAjv = name => {
      if (name === 'AjvOld') return global.Ajv
      const exported = global.ajv7[name]
      return !exported.$schema && exported.default || exported
    }
    factory(global.jsonlintValidator = {}, global.jsonlint, requireAjv)
  }
}(this, function (exports, jsonlint, requireAjv) {
  'use strict'

  function addErrorLocation (problem, input, tokens, dataPath) {
    const token = tokens.find(function (token) {
      return dataPath === jsonlint.pathToPointer(token.path)
    })
    if (token) {
      const location = token.location.start
      const offset = location.offset
      const line = location.line
      const column = location.column
      const texts = jsonlint.getErrorTexts(problem.reason, input, offset, line, column)
      problem.message = texts.message
      problem.excerpt = texts.excerpt
      if (texts.pointer) {
        problem.pointer = texts.pointer
        problem.location = {
          start: {
            column,
            line,
            offset
          }
        }
      }
      return true
    }
  }

  function errorToProblem (error, input, tokens) {
    const dataPath = error.dataPath
    const schemaPath = error.schemaPath
    const reason = (dataPath || '/') + ' ' + error.message + '; see ' + schemaPath
    const problem = {
      reason,
      dataPath,
      schemaPath
    }
    if (!addErrorLocation(problem, input, tokens, dataPath)) {
      problem.message = reason
    }
    return problem
  }

  function createError (errors, data, input, options) {
    if (!input) {
      input = JSON.stringify(data, undefined, 2)
    }
    if (!options) {
      options = {}
    }
    Object.assign(options, {
      tokenLocations: true,
      tokenPaths: true
    })
    const tokens = jsonlint.tokenize(input, options)
    // var problems = errors.map(function (error) {
    //   return errorToProblem(error, input, tokens)
    // })
    // var message = problems
    //   .map(function (problem) {
    //     return problem.message
    //   })
    //   .join('\n')
    const problem = errorToProblem(errors[0], input, tokens)
    const error = new SyntaxError(problem.message)
    Object.assign(error, problem)
    return error
  }

  function createAjv (environment) {
    let ajv
    if (!environment || environment === 'json-schema-draft-06' || environment === 'draft-06') {
      const Ajv = requireAjv('Ajv07')
      ajv = new Ajv()
      ajv.addMetaSchema(requireAjv('Schema06'))
    } else if (environment === 'json-schema-draft-07' || environment === 'draft-07') {
      const Ajv = requireAjv('Ajv07')
      ajv = new Ajv()
    } else if (environment === 'json-schema-draft-04' || environment === 'draft-04') {
      const Ajv = requireAjv('AjvOld')
      ajv = new Ajv({ schemaId: 'id' })
      ajv.addMetaSchema(requireAjv('Schema04'))
    } else if (environment === 'json-schema-draft-2019-09' || environment === 'draft-2019-09') {
      const Ajv = requireAjv('Ajv2019')
      ajv = new Ajv()
    } else if (environment === 'json-schema-draft-2020-12' || environment === 'draft-2020-12') {
      const Ajv = requireAjv('Ajv2020')
      ajv = new Ajv()
    } else if (environment === 'json-type-definition' || environment === 'jtd' || environment === 'rfc8927') {
      const Ajv = requireAjv('AjvJTD')
      ajv = new Ajv()
    } else {
      throw new RangeError('Unsupported environment for the JSON Schema validation: "' +
        environment + '".')
    }
    return ajv
  }

  function compileSchema (ajv, schema, parseOptions) {
    let parsed
    try {
      parsed = jsonlint.parse(schema, parseOptions)
    } catch (error) {
      error.message = 'Parsing the JSON Schema failed.\n' + error.message
      throw error
    }
    try {
      return ajv.compile(parsed)
    } catch (originalError) {
      const errors = ajv.errors
      const betterError = errors
        ? createError(errors, parsed, schema, parseOptions)
        : originalError
      betterError.message = 'Compiling the JSON Schema failed.\n' + betterError.message
      throw betterError
    }
  }

  function compile (schema, environment) {
    let options = {}
    if (typeof environment === 'object' && !(environment instanceof String)) {
      options = environment
      environment = options.environment
    }
    const ajv = createAjv(environment)
    const parseOptions = {
      mode: options.mode,
      ignoreBOM: options.ignoreBOM,
      ignoreComments: options.ignoreComments,
      ignoreTrailingCommas: options.ignoreTrailingCommas,
      allowSingleQuotedStrings: options.allowSingleQuotedStrings,
      allowDuplicateObjectKeys: options.allowDuplicateObjectKeys
    }
    const validate = compileSchema(ajv, schema, parseOptions)
    return function (data, input, options) {
      if (typeof data === 'string' || data instanceof String) {
        options = input
        input = data
        data = jsonlint.parse(input, options)
      } else if (!(typeof input === 'string' || input instanceof String)) {
        options = input
        input = undefined
      }
      if (validate(data)) {
        return data
      }
      throw createError(validate.errors, data, input, options)
    }
  }

  exports.compile = compile

  Object.defineProperty(exports, '__esModule', { value: true })
}))

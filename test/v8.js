/* eslint-disable no-eval */

const test = require('tehanu')(__filename)
const assert = require('node:assert')

const { readdirSync, readFileSync } = require('node:fs')
const { join, resolve } = require('node:path')

const { parse } = require('..')

const root = resolve(__dirname, 'v8')
const directories = readdirSync(root)

function addTest (input, filePath) {
  let x
  let z
  try {
    x = parse(input, { mode: 'json5' })
  } catch {
    x = 'fail'
  }
  try {
    z = eval(`(function(){"use strict"\nreturn (${String(input)}\n)\n})()`)
  } catch {
    z = 'fail'
  }
  if (Number.isNaN(x)) x = '_NaN'
  if (Number.isNaN(z)) z = '_NaN'
  if (filePath.endsWith('.txt')) {
    assert.deepEqual(x, z)
  }
}

function createTest (fileName, directory) {
  const filePath = join(root, directory, fileName)
  const source = readFileSync(filePath, 'utf8')
  test(fileName, addTest.bind(null, source, filePath))
}

for (const directory of directories) {
  // otherwise create a test for each file in this group
  for (const file of readdirSync(join(root, directory))) {
    createTest(file, directory)
  }
}

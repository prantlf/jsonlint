/* eslint-disable no-eval */

const test = require('tehanu')(__filename)
const assert = require('assert')

const fs = require('fs')
const path = require('path')

const { parse } = require('..')

const root = path.resolve(__dirname, 'v8')
const directories = fs.readdirSync(root)

function addTest (input, filePath) {
  let x, z
  try {
    x = parse(input, { mode: 'json5' })
  } catch {
    x = 'fail'
  }
  try {
    z = eval('(function(){"use strict"\nreturn (' + String(input) + '\n)\n})()')
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
  const filePath = path.join(root, directory, fileName)
  const source = fs.readFileSync(filePath, 'utf8')
  test(fileName, addTest.bind(null, source, filePath))
}

directories.forEach(function (directory) {
  // otherwise create a test for each file in this group:
  fs.readdirSync(path.join(root, directory)).forEach(function (file) {
    createTest(file, directory)
  })
})

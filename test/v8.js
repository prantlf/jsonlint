/* eslint-disable node/no-deprecated-api, no-eval */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const parse = require('..').parse

const root = path.resolve(__dirname, 'v8')
const directories = fs.readdirSync(root)

function addTest (arg, filePath) {
  let x
  try {
    x = parse(arg, { mode: 'json5' })
  } catch (err) {
    x = 'fail'
  }
  let z
  try {
    z = eval('(function(){"use strict"\nreturn (' + String(arg) + '\n)\n})()')
  } catch (err) {
    z = 'fail'
  }
  if (Number.isNaN(x)) x = '_NaN'
  if (Number.isNaN(z)) z = '_NaN'
  try {
    assert.deepEqual(x, z)
  } catch (error) {
    console.log(filePath)
    throw error
  }
}

function createTest (fileName, directory) {
  const filePath = path.join(root, directory, fileName)
  const source = fs.readFileSync(filePath, 'utf8')
  addTest(source, filePath)
}

directories.forEach(function (directory) {
  // create a test suite for this group of tests:
  exports[directory] = {}

  // otherwise create a test for each file in this group:
  fs.readdirSync(path.join(root, directory)).forEach(function (file) {
    createTest(file, directory)
  })
})

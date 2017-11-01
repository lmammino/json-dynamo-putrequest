#!/usr/bin/env node

const { createReadStream, createWriteStream } = require('fs')
const { resolve } = require('path')
const { parse } = require('JSONStream')
const yargs = require('yargs')
const through2 = require('through2')
const convertObj = require('json-to-dynamo')
const pump = require('pump')

const argv = yargs
  .usage(
    '$0 <tableName> [sourceFile]',
    'Converts a JSON input into a JSON containing a set of DynamoDB PutRequests',
    (yargs) => {
      yargs
        .positional('tableName', {
          describe: 'The name of the DynamoDB table',
          type: 'string'
        })
        .positional('sourceFile', {
          describe: 'The source JSON file. If not specified the data will be read from the standard input',
          type: 'string'
        })
    }
  )
  .option('output', {
    alias: 'o',
    describe: 'the output file, if specified the output will be written in the file'
  })
  .option('beautify', {
    alias: 'b',
    describe: 'the output file, if specified the output will be written in the file',
    boolean: true
  })
  .version()
  .argv

const inputStream = argv.sourceFile
  ? createReadStream(argv.sourceFile)
  : process.stdin
const outputStream = argv.output
  ? createWriteStream(argv.output, 'utf8')
  : process.stdout

inputStream.resume()
inputStream.setEncoding('utf8')

const convertObjectToPutRequest = (obj) => ({
  PutRequest: {
    Item: convertObj(obj)
  }
})

const convertForDynamo = (data, tableName) => {
  const result = {
    [tableName]: data.map(convertObjectToPutRequest)
  }

  return result
}

const convertObject = (tableName) => through2.obj(function (obj, enc, callback) {
  if (!Array.isArray(obj)) {
    throw new Error('Input data needs to be an array')
  }
  const data = convertForDynamo(obj, tableName)
  this.push(JSON.stringify(data, null, argv.beautify ? 2 : undefined))
  callback()
})

pump(
  inputStream,
  parse(),
  convertObject(argv.tableName),
  outputStream,
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }

    if (argv.output) {
      console.log(`Output saved in ${resolve(argv.output)}`)
    }
  }
)

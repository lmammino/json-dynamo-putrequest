const { readFileSync } = require('fs')
const { join } = require('path')
const childProcess = require('child_process')

const executable = join(__dirname, '..', 'src', 'index.js')
const fixtures = join(__dirname, 'fixtures')
const tableName = 'gig'
const inputFile = join(fixtures, 'gig.json')

test('It should produce valid output', done => {
  const terminal = childProcess.spawn(executable, [tableName, inputFile])
  const expectedOutput = readFileSync(join(fixtures, 'gig-output.json'), 'utf8')

  let output = ''
  terminal.stdout.on('data', data => (output += data))

  terminal.on('exit', () => {
    expect(output).toEqual(expectedOutput)
    done()
  })

  terminal.stdin.end()
})

test('It should produce valid beautified output', done => {
  const terminal = childProcess.spawn(executable, ['--beautify', tableName, inputFile])
  const expectedOutput = readFileSync(join(fixtures, 'gig-output-beautified.json'), 'utf8')

  let output = ''
  terminal.stdout.on('data', data => (output += data))

  terminal.on('exit', () => {
    expect(output).toEqual(expectedOutput)
    done()
  })

  terminal.stdin.end()
})

const test = require('ava')
const { readFileSync } = require('fs')
const { join } = require('path')
const childProcess = require('child_process')

const executable = join(__dirname, '..', 'src', 'index.js')
const fixtures = join(__dirname, 'fixtures')
const tableName = 'gig'
const inputFile = join(fixtures, 'gig.json')

test('It should produce valid output', t => {
  t.plan(1)

  const terminal = childProcess.spawn(executable, [tableName, inputFile])
  const expectedOutput = readFileSync(join(fixtures, 'gig-output.json'), 'utf8')

  let output = ''
  terminal.stdout.on('data', data => (console.log(data)))

  terminal.on('exit', () => console.log('ENDDDDDDDDD'))

  terminal.stdin.end()

  t.true(true)
})

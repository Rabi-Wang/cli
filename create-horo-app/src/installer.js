const chalk = require('chalk')
const readline = require('readline')

function renderProgressBar(curr, total) {
  const ratio = Math.min(Math.max(curr / total, 0), 1)
  const bar = `${curr}/${total}`
  const availableSpace = Math.max(0, process.stderr.columns - bar.length - 3)
  const width = Math.min(total, availableSpace)
  const completeLength = Math.round(width * ratio)
  const complete = '#'.repeat(completeLength)
  const incomplete = `-`.repeat(width - completeLength)
  // console.log(complete)
  toStartOfLine(process.stderr)
  process.stderr.write(`[${complete}${incomplete}]${bar}`)
}

function toStartOfLine(stream) {
  if (!chalk.supportsColor) {
    stream.write('\r\n')
    return
  }
  readline.cursorTo(stream, 0)
}

for (let i = 0; i < 100; i++) {
  setTimeout(() => {
    renderProgressBar(i, 1000)
  }, 1000)
}

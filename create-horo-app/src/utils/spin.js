const ora = require('ora')
const chalk = require('chalk')

const spin = ora()
let lastMsg = null

const logWithSpin = (symbol, msg) => {
  if (!msg) {
    msg = symbol
    symbol = chalk.green('✔')
  }

  if (lastMsg) {
    spin.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text,
    })

    spin.text = ' ' + msg
    lastMsg = {
      symbol: symbol + ' ',
      text: msg,
    }
    spin.start()
  }
}

const stopSpin = (persist) => {
  if (lastMsg && persist) {
    spin.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text,
    })
  } else {
    spin.stop()
  }
  lastMsg = null
}

const pauseSpin = () => {
  spin.stop()
}

const resumeSpin = () => {
  spin.start()
}

module.exports = {
  stopSpin,
  pauseSpin,
  resumeSpin,
  logWithSpin,
}

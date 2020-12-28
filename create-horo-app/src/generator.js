const { EventEmitter } = require('events')
const chalk = require('chalk')
const { logWithSpin, stopSpin } = require('./utils')
const inquirer = require('inquirer')
const packageJson = require('../package')

class Generator extends EventEmitter {
  constructor (name, context) {
    super()
    this.name = name
    this.context = context
    this.run = this.run.bind(this)
  }

  async create(options) {
    const { name, context, run, emit } = this

    console.log(chalk.blue.bold(`create-horo-app v${packageJson.version}`))
    logWithSpin('✨', `creating ${chalk.yellow(context)}`)
    emit('creation', { event: 'creating' })

    stopSpin()

    const {  } = await inquirer.prompt([
      {
        name: 'tsSupport',
        message: 'Would you like a ts project or a js project?',
        default: 'js',
      }
    ])
  }
}

module.exports = {
  Generator
}

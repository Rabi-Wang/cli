#!/usr/bin/env node
const { Command } = require('commander')
const minimist = require('minimist')
const semver = require('semver')
const chalk = require('chalk')
const { create } = require('./create')
const packageJson = require('../package')

const program = new Command(packageJson.name)

// console.log(process.argv)
// console.log(minimist(process.argv.slice(2)))
// console.log(minimist(process.argv.slice(2))._)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

checkNodeVersion('>=12')

program
  .version(`${packageJson.version}`, '-v, --version')

program
  .arguments('<app-name>')
  .description('create a new project')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n You input project name more than 1, it will use the first one'))
    }
    create(name, options)
  })

program.parse(process.argv)

function checkNodeVersion(wanted) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(`Your Node version is ${process.version}, but this script expect ${wanted}, please update your Node`))
    process.exit(1)
  }
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach((o) => {
    const key = camelize(o.long.replace(/^--/, ''))

    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })

  return args
}

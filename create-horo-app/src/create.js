const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const validatePackageName = require('validate-npm-package-name')

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.resolve('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  const result = validatePackageName(name)
  const { fource } = options

  console.log(options)
  console.log(cwd)
  console.log(inCurrent)
  console.log(name)
  console.log(targetDir)
  console.log(result)

  if (!result.validForNewPackages) {
    console.error(chalk.red(`invalid project name ${name}`))
    result.errors && result.errors.forEach(err => console.error(chalk.red.dim('❌ ' + err)))
    result.warnings && result.warnings.forEach(warn => console.error(chalk.red.dim('⚠ ' + warn)))
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
     if (fource) {
       await fs.remove(targetDir)
     } else {
       const { action } = await inquirer.prompt({
         name: 'action',
         type: 'list',
         message: `directory ${chalk.cyan(targetDir)} has exist, please chose:`,
         choices: [
           { name: 'overwrite', value: 'overwrite' },
           { name: 'cancel', value: false },
         ]
       })

       if (!action) {
         return
       } else if (action === 'overwrite') {
         console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
         await fs.remove(targetDir)
       }
     }
  }

  console.log('---- create ----')
}

module.exports = {
  create
}

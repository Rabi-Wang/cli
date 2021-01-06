const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const validatePackageName = require('validate-npm-package-name')
const execSync = require('child_process').execSync
const { spawn } = require('cross-spawn')
const ora = require('ora')
const logSymbols = require('log-symbols')
const download = require('download-git-repo')

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.resolve('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  const result = validatePackageName(name)
  const { force } = options

  if (!result.validForNewPackages) {
    console.error(chalk.red(`invalid project name ${name}`))
    result.errors && result.errors.forEach(err => console.error(chalk.red.dim(`${logSymbols.error} ${err}`)))
    result.warnings && result.warnings.forEach(warn => console.error(chalk.red.dim(`${logSymbols.warning} ${warn}`)))
    process.exit(1)
  }

  if (fs.existsSync(targetDir)) {
     const spinner = ora(`Removing ${chalk.cyan(targetDir)}`)
     if (force) {
       try {
         spinner.start()
         await fs.remove(targetDir)
         spinner.succeed()
       } catch (e) {
         spinner.fail()
       }
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
         try {
           spinner.start()
           await fs.remove(targetDir)
           spinner.succeed()
         } catch (e) {
           spinner.fail()
         }
       }
     }
  }

  console.log(chalk.green(`start create ${projectName}...`))

  fs.ensureDirSync(targetDir)

  // const packageJson = {
  //   name: projectName,
  //   version: '0.1.0',
  //   private: true,
  // }
  //
  // fs.writeFileSync(
  //   path.join(targetDir, 'package.json'),
  //   JSON.stringify(packageJson, null, 2)
  // )

  const spinner = ora('creating template')
  try {
    spinner.start()
    let downloadUrl = 'http://10.124.163.76:8888/group-customer-platform/OrderCenter/frontend/frontend.git'
    let downlaodTarget = path.join(__dirname, '../test')
    // await downloadTemplate(downloadUrl, downlaodTarget)

    if (fs.existsSync(path.join(__dirname, '../template'))) {
      fs.copySync(path.join(__dirname, '../template'), targetDir)
      const packageJson = require(path.join(targetDir, './package.json'))
      packageJson.name = projectName
      fs.writeFileSync(
        path.join(targetDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      )
      execSync('npm init --y', { cwd: targetDir, stdio: 'inherit' })
    }
    if (fs.existsSync(path.join(__dirname, '../build'))) {
      fs.copySync(path.join(__dirname, '../build'), path.join(targetDir, './build'))
    }
    spinner.succeed()
  } catch (e) {
    spinner.fail()
  }

  const templatePackageJsonPath = path.join(targetDir, './package.json')
  const hasPackageJson = fs.existsSync(templatePackageJsonPath)
  if (hasPackageJson) {
    const { devDependencies = {}, dependencies = {} } = require(templatePackageJsonPath)
    const devDepsKeys = Object.keys(devDependencies)
    const depsKeys = Object.keys(dependencies)
    let deps = []
    depsKeys.forEach(key => deps.push(`${key}@${dependencies[key]}`))
    devDepsKeys.forEach(key => deps.push(`${key}@${devDependencies[key]}`))
    installDependencies(targetDir, deps).then(() => {
      console.log(chalk.green(`${logSymbols.success} create ${projectName} success, joy codding`))

      try {
        if (shouldUseYarn()) {
          execSync('yarn run start', { cwd: targetDir, stdio: 'inherit' })
        } else {
          execSync('npm start', { cwd: targetDir })
        }
      } catch (e) {
        console.log(e)
      }
    })
  }

  // const generator = new Generator(name, targetDir)
  // await generator.create()
}

function downloadTemplate(url, target) {
  return new Promise((resolve, reject) => {
    const spinner = ora('download template')
    spinner.start()
    download(url, target, { clone: true }, (err) => {
      if (err) {
        console.log(chalk.red(err))
        spinner.fail()
        reject(err)
      } else {
        spinner.succeed()
        resolve()
      }
    })
  })
}

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function installDependencies (targetDir, dependencies) {
  return new Promise((resolve, reject) => {
    let command
    let args
    let useYarn = shouldUseYarn()
    if (useYarn) {
      command = 'yarnpkg'
      args = ['add', '--exact']
      ;[].push.apply(args, dependencies)
      // args.push('--cwd')
      // args.push(targetDir)
    } else {
      command = 'npm'
      args = [
        'install',
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
      ].concat(dependencies)
    }

    const child = spawn(command, args, { stdio: 'inherit', cwd: targetDir })
    child.on('close', (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        })
        return
      }
      resolve()
    })
  })
}

module.exports = {
  create
}

const path = require('path')
const fs = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')
const validatePackageName = require('validate-npm-package-name')
const execSync = require('child_process').execSync
const { spawn } = require('cross-spawn')

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.resolve('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  const result = validatePackageName(name)
  const { fource } = options

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

  fs.copySync(path.join(__dirname, '../template'), targetDir)
  fs.copySync(path.join(__dirname, '../build'), path.join(targetDir, './build'))

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
      console.log(chalk.green(`✔ create ${projectName} success, joy codding`))

      if (shouldUseYarn()) {
        execSync('yarn run start', { cwd: targetDir, stdio: 'inherit' })
      } else {
        execSync('npm start', { cwd: targetDir })
      }
    })
  }

  // const generator = new Generator(name, targetDir)
  // await generator.create()
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

const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const clear = require('clear')
const execa = require('execa')
const inquirer = require('inquirer')
const validateName = require('./util/validateName')

async function create(name, options) {

  const cwd = options.cwd || process.cwd()
  const targetDir = path.resolve(cwd, name || '.')

  validateName(name, targetDir, options)

  if (fs.existsSync(targetDir) && !options.force) {
    console.error(chalk.red(`Target directory "${name}" already exists`))
    process.exit(1)
  }

  const { action } = await selectProjectStartup()
  if (!action) return

  const config = await getConfig(name, targetDir, action)
  await startConfig(config, options)

  console.log(`\nSuccessfully created project ${chalk.yellow(name)}.`)
  console.log(
    `Get started with the following commands:\n` +
    chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`) +
    chalk.cyan(` ${chalk.gray('$')} npm run serve\n`)
  )

}

async function startConfig(config, options) {
  if (options.force) {
    console.log(`Removing ${chalk.cyan(config.name)}...`)
    fs.removeSync(config.targetDir)
  }
  await copyFiles(config.targetDir)
  await createProject(config)
  await installDeps(config.targetDir)
}

async function copyFiles(targetDir) {
  console.log(`Copying files...`)
  await fs.copy(__dirname + '/util/project/vue', targetDir);
}

async function installDeps(targetDir) {
  console.log(`Installing dependencies...`)
  fs.removeSync(`${targetDir}/package-lock.json`)
  return await execa('npm', ['install', '--loglevel', 'error'], {
    cwd: targetDir,
    stdio: ['inherit', 'inherit', 'inherit']
  })
}

async function selectProjectStartup() {
  clear()
  return await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: `Select a startup option:`,
      choices: [
        { name: 'Sidemenu', value: 'sidemenu' },
        { name: 'Blank', value: 'blank' },
        { name: 'Cancel', value: false }
      ]
    }
  ])
}

async function getConfig(name, targetDir, action) {
  return await {
    name,
    action,
    targetDir,
    title: (await getTitle()).title,
    version: (await getVersion()).version,
    description: (await getDescription()).description,
    endPoint: (await getEndpoint()).endPoint,
    metadataEndPoint: (await getMetadataEndpoint()).metadataEndPoint,
    homeUrl: (await getHomeUrl()).homeUrl,
    staticAppMetadata: true,
  }
}

async function getTitle() {
  return await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: `Enter a title:`,
      default: 'Zeedhi',
    }
  ])
}

async function getDescription() {
  return await inquirer.prompt([
    {
      name: 'description',
      type: 'input',
      message: `Enter a project description:`,
      default: 'Powered by Zeedhi',
    }
  ])
}

async function getVersion() {
  return await inquirer.prompt([
    {
      name: 'version',
      type: 'input',
      message: `Enter a project version:`,
      default: '0.1.0',
    }
  ])
}

async function getEndpoint() {
  return await inquirer.prompt([
    {
      name: 'endPoint',
      type: 'input',
      message: `Enter a endpoint:`,
      default: 'http://localhost:8081/',
    }
  ])
}

async function getMetadataEndpoint() {
  return await inquirer.prompt([
    {
      name: 'metadataEndPoint',
      type: 'input',
      message: `Enter a metadata endpoint:`,
      default: 'http://localhost:8081/metadata/',
    }
  ])
}

async function getHomeUrl() {
  return await inquirer.prompt([
    {
      name: 'homeUrl',
      type: 'input',
      message: `Enter a home url:`,
      default: '/',
    }
  ])
}

async function createProject(config) {
  return await require('./util/project/run')(config)
}

module.exports = (...args) => {
  return create(...args)
}
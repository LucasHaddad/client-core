const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const clear = require('clear')
const createJest = require('./createJest')
const createTslint = require('./createTsLint')
const createReadme = require('./createReadme')
const createTsConfig = require('./createTsConfig')
const createNpmIgnore = require('./createNpmignore')
const createRollupConfig = require('./createRollup')
const createPackageConfig = require('./createPackage')
const createEmptyProject = require('./createEmptyComponent')

function run(name, targetDir, options) {
  const dir = path.join(targetDir, name, '/')
  const vueDir = path.join(targetDir, name + '-vue', '/')

  if (options.force) {
    console.log(`Removing ${chalk.cyan(name)}...`)
    fs.removeSync(dir)
    console.log(`Removing ${chalk.cyan(name + '-vue')} ...`)
    fs.removeSync(vueDir)
  }

  if (fs.existsSync(dir) || fs.existsSync(vueDir)) {
    if (fs.existsSync(dir)) {
      console.error(chalk.red(`Directory ${name} already exists`))
    }
    if (fs.existsSync(vueDir)) {
      console.error(chalk.red(`Directory ${name}-vue already exists`))
    }
    process.exit(1)
  }
  clear()
  createComponent(name, dir)
  console.log(`Component ${name} created`)
  createComponent(name, vueDir, true)
  console.log(`Component ${name}-vue created`)
}

function createComponent(name, dir, isVue) {
  createEmptyProject(name, dir, isVue)
  createPackageConfig(name, dir, isVue)
  createReadme(name, dir, isVue)
  createRollupConfig(dir)
  createNpmIgnore(dir)
  createTsConfig(dir)
  createTslint(dir)
  createJest(dir)
}

module.exports = async (...args) => {
  return await run(...args)
}

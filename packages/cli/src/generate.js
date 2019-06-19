const path = require('path')
const chalk = require('chalk')
const validateName = require('./util/validateName')

async function generate(name, options) {
  const cwd = options.cwd || process.cwd()
  let targetDir = path.resolve(cwd, '.')

  if (options.path) {
    targetDir = path.resolve(targetDir, options.path)
  }

  validateName(name, targetDir, options)
  require('./util/component/run')(name, targetDir, options)
  console.log(`\nSuccessfully created component ${chalk.yellow(name)} at path ${chalk.yellow(targetDir)}.`)

}

module.exports = (...args) => {
  return generate(...args)
}
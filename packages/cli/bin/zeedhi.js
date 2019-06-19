#!/usr/bin/env node
const chalk = require('chalk')
const semver = require('semver')
const requiredVersion = require('../package.json').engines.node

function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, 'zeedhi-cli')

const program = require('commander')
const generateOptions = ['component']

program
  .version(require('../package').version)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('create a new Zeedhi project using VueJS')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action(function(name, cmd) {
    require('../src/create')(name, cleanArgs(cmd))
  })

program
  .command('generate <type> <name>').alias('g')
  .description('automatically create framework features')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .option('-p, --path <path>', 'Path where this feature will be created (default ./)')
  .action(generateAction)
  .on('--help', generateHelper)

program.on('--help', () => {
  console.log()
  console.log(`  Run ${chalk.cyan(`zeedhi <command> --help`)} for detailed usage of given command.`)
  console.log()
})

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
  })

program.commands.forEach(c => c.on('--help', () => console.log()))

const enhanceErrorMessages = require('../src/util/enhanceErrorMessages')

enhanceErrorMessages('missingArgument', argName => {
  return `Missing required argument ${chalk.yellow(`<${argName}>`)}.`
})

enhanceErrorMessages('unknownArgument', argumentName => {
  return `Unknown argument ${chalk.yellow(argumentName)}.`
})

enhanceErrorMessages('unknownOption', optionName => {
  return `Unknown option ${chalk.yellow(optionName)}.`
})

enhanceErrorMessages('optionMissingArgument', (option, flag) => {
  return `Missing required argument for option ${chalk.yellow(option.flags)}` + (
    flag ? `, got ${chalk.yellow(flag)}` : ``
  )
})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

function generateAction(type, name, cmd) {
  if (type && name) {
    if (generateOptions.find(option => option === type)) {
      require('../src/generate')(name, cleanArgs(cmd))
    } else {
      this.unknownArgument(type)
    }
  } else {
    this.outputHelp()
  }
}

function generateHelper() {
  console.log('')
  console.log(chalk.white.bold('  Usage:'))
  console.log('')
  console.log(`    ${chalk.gray('$')} ${chalk.green('zeedhi g <type> <name>')}`)
  console.log('')
  console.log(chalk.white.bold('  Inputs:'))
  console.log('')
  console.log(`    ${chalk.green('type')} ${chalk.gray('..........')} The type of feature (e.g. ${chalk.green(generateOptions.join(','))})`)
  console.log(`    ${chalk.green('name')} ${chalk.gray('..........')} The name of the feature being generated`)
  console.log('')
  console.log(chalk.white.bold('  Examples:'))
  console.log('')
  console.log(`    ${chalk.gray('$')} ${chalk.green('zeedhi g component zd-clock')}`)
}
const fs = require('fs')
const path = require('path')

createTestFolder = (dir) => {
  fs.mkdirSync(path.resolve(dir, 'tests'))
  fs.mkdirSync(path.resolve(dir, 'tests/unit'))
}

createConfigFile = (dir) => {
  const config = "module.exports = require('../../jest.config.js')"
  const configPath = path.resolve(dir, 'jest.config.js')
  fs.writeFile(configPath, config, (err) => {
    if(err) console.log(err)
  })
}

module.exports = (dir) => {
  createTestFolder(dir)
  createConfigFile(dir)
}
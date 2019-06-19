const path = require('path')
const fs = require('fs-extra')

function getPackageJsonContent(filePath, config) {
  const pkg = require(filePath)
  pkg.name = config.name
  pkg.description = config.description
  pkg.version = config.version
  return pkg
}

editPackageJson = (config) => {
  const filePath = path.resolve(config.targetDir, 'package.json')
  const content = getPackageJsonContent(filePath, config)
  fs.writeJsonSync(filePath, content, { spaces: 2 })
}

module.exports = (config) => {
  editPackageJson(config)
}
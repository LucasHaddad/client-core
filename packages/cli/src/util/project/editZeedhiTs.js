const path = require('path')
const fs = require('fs-extra')

createConfig = (config) => {
  const filePath = path.resolve(config.targetDir + '/src', 'zeedhi.ts')
  let content = fs.readFileSync(filePath, 'utf8')
  content = content.replace('<END_POINT>', `'${config.endPoint}'`)
  content = content.replace('<FRAMEWORK_UI>', `'${config.frameworkUi}'`)
  content = content.replace('<HOME_URL>', `'${config.homeUrl}'`)
  content = content.replace('<LIBRARY>', `'${config.library}'`)
  content = content.replace('<METADATA_END_POINT>', `'${config.metadataEndPoint}'`)
  content = content.replace('<STATIC_APP_METADATA>', config.staticAppMetadata)
  content = content.replace('<TITLE>', `'${config.title}'`)
  fs.writeFileSync(filePath, content)
}

module.exports = (config) => {
  createConfig(config)
}
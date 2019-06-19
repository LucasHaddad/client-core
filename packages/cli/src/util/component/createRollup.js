const path = require('path')
const fs = require('fs')

createRollupConfig = (dir) => {
  let config = 'import { getDefaultConfig } from "../../rollup.config.js";\nimport pkg from "./package.json"\n'
  config += '\nexport default getDefaultConfig(pkg);\n'
  const configPath = path.resolve(dir, 'rollup.config.js')

  fs.writeFile(configPath, config, (err) => {
    if(err) console.log(err)
  })
}

module.exports = (dir) => {
  createRollupConfig(dir)
}
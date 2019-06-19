const fs = require('fs')
const path = require('path')

createTsConfig = (dir) => {
  let config = {
    extends: '../../tsconfig.json',
    include: [ './src/**/*' ],
    exclude: [ 'node_modules' ],
    compilerOptions: {
      declarationDir: "./types",
      outDir: './dist'
    }
  }

  let configPath = path.resolve(dir, 'tsconfig.json')
  config = JSON.stringify(config, null, 2)

  fs.writeFile(configPath, config, (err) => {
    if(err) console.log(err)
  })
}

module.exports = (dir) => {
  createTsConfig(dir)
}
const fs = require('fs')
const path = require('path')

createTslint = (dir) => {
  let config = {
    extends: '../../tslint.json'
  }

  let configPath = path.resolve(dir, 'tslint.json')
  config = JSON.stringify(config, null, 2)

  fs.writeFile(configPath, config, (err) => {
    if(err) console.log(err)
  })
}

module.exports = (dir) => {
  createTslint(dir)
}
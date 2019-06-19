const path = require('path')
const fs = require('fs')

createNpmIgnore = (dir) => {
  let config = `src\njest.config.js\npackage-lock.json\nrollup.config.js\ntsconfig.json\ntslint.json`
  const configPath = path.resolve(dir, '.npmignore')

  fs.writeFile(configPath, config, (err) => {
    if(err) console.log(err)
  })
}

module.exports = (component, dir) => {
  createNpmIgnore(component, dir)
}
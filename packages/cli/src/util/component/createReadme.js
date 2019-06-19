const path = require('path')
const fs = require('fs')

createReadme = (component, dir, isVue) => {
  let name = isVue ? component + '-vue' : component
  let config = `# ${name}`
  const configPath = path.resolve(dir, 'README.md')

  fs.writeFile(configPath, config, (err) => {
    if(err) console.log(err)
  })
}

module.exports = (component, dir, isVue) => {
  createReadme(component, dir, isVue)
}
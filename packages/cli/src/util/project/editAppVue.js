const fsE = require('fs-extra')
const fs = require('fs')
const path = require('path')
const projecTypes = ['sidemenu', 'blank'];

editAppVue = (config) => {
  const filePath = path.resolve(config.targetDir + '/src', `App.${config.action}.vue`)
  const newPath = path.resolve(config.targetDir + '/src', `App.vue`)

  if (config.action === 'sidemenu') {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace('<NAME>', `'${config.name}'`)
    content = content.replace('<TITLE>', `'${config.title}'`)
    fs.writeFileSync(filePath, content)
  }

  fs.renameSync(filePath, newPath)

  projecTypes.forEach((type) => {
    if (type !== config.action) {
      const deletePath = path.resolve(config.targetDir + '/src', `App.${type}.vue`)
      fsE.removeSync(deletePath);
    }
  })
}

module.exports = (config) => {
  editAppVue(config)
}

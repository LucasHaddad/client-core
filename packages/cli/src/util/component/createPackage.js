const path = require('path')
const fs = require('fs')

createPackageConfig = (component, dir, isVue) => {
  let name = isVue ? component + '-vue' : component
  let config = {
    name: `@zeedhi-components/${name}`,
    version: '0.1.0',
    description: name,
    author: "Zeedhi <zeedhi@teknisa.com>",
    homepage: `https://bitbucket.org/zeedhi/zeedhi-components/src/master/packages/${name}#readme`,
    license: "ISC",
    main: `dist/${name}.umd.js`,
    module: `dist/${name}.esm.js`,
    typings: "types/index.d.ts",
    scripts: {
      build: "rollup -c",
      lint: "tslint -p tsconfig.json -c tslint.json",
      test: 'jest',
      watch: "rollup -cw"
    },
    repository: {
      type: "git",
      url: "git@bitbucket.org:zeedhi/zeedhi-components.git"
    },
    publishConfig: {
      access: "restricted"
    },
    dependencies: getDependencies(isVue, component)
  }

  let configPath = path.resolve(dir, 'package.json')
  config = JSON.stringify(config, null, 2)

  fs.writeFile(configPath, config, (err) => {
    if(err) console.log(err)
  })
}

getDependencies = (isVue, component) => {
  let dependencies = { "@zeedhi/core": "*" }
  if (isVue) {
    Object.assign(dependencies, {
      [`@zeedhi-components/${component}`]: "*",
      "@zeedhi/vue": "*"
    })
  }
  return dependencies
}

module.exports = (component, dir, isVue) => {
  createPackageConfig(component, dir, isVue)
}
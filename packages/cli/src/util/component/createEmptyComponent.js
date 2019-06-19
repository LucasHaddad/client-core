const fs = require('fs-extra')
const path = require('path')

snakeToCamelCase = (str) => {
  let pieces = str.split('-')
  let result = ''
  pieces.forEach((piece) => {
    piece = piece.charAt(0).toUpperCase() + piece.slice(1)
    result += piece
  })
  return result
}

getBaseComponentContent = (name, dir) => {
  let className = `${name}Base`
  let content = `<template>\n    <div>This template should not be here!</div>\n</template>\n\n`
  content += `<script lang="ts">\nimport { ${className} } from '${dir}${className}';\n`
  content += "import { zdComponent } from '@zeedhi/vue';\n\n"
  content += "@zdComponent\n"
  content += `export default class ${name} extends ${className} {}\n</script>\n`
  return content
}

getBaseClassContent = (name) => {
  let content = `import { I${name} } from './I${name}';\n`
  content += `import { Component } from '@zeedhi/core';\n\n`
  content += `export class ${name}Class extends Component implements I${name} {}\n`
  return content
}

getBaseClassVueContent = (sigleName, name) => {
  let content = "import { Vue, zdComponent, zdProp } from '@zeedhi/vue';\n"
  content += `import { ${name}Class } from '@zeedhi-components/${sigleName}';\n\n`
  content += "@zdComponent\n"
  content += `export class ${name}Base extends Vue {\n\n`
  content += `  @zdProp() component!: ${name}Class;\n\n`
  content += "}\n"
  return content
}

getBaseInterfaceContent = (name) => {
  let content = "import { IComponent } from '@zeedhi/core';\n\n"
  content += `export interface I${name} extends IComponent {}\n`
  return content
}

baseIndex = (name) => {
  const camelCased = snakeToCamelCase(name)
  let content = `import { ${camelCased}Class } from './components/${camelCased}Class';\n`
  content += `import { I${camelCased} } from './components/I${camelCased}';\n\n`
  content += `export { ${camelCased}Class, I${camelCased} };\n`
  return content
}

baseIndexVue = (name) => {
  const singleName = 'MainComp'
  const camelCased = snakeToCamelCase(name)
  let content = `import * as ${singleName} from './components/${camelCased}.vue';\n`
  content += `import ${camelCased}Vuetify from './components/vuetify/${camelCased}.vue';\n`
  content += `import { ${camelCased}Class } from '@zeedhi-components/${name}';\n`
  content += "import { config } from '@zeedhi/core';\n"
  content += "import { registerComponent } from '@zeedhi/vue';\n\n"
  content += "// tslint:disable-next-line:variable-name\n"
  content += `const ${camelCased} = {\n`
  content += "  install () {\n"
  content += `    let component = ${singleName}.default;\n`
  content += "    if (config.frameworkUi === 'vuetify') {\n"
  content += `      component = ${camelCased}Vuetify;\n`
  content += "    }\n"
  content += `    registerComponent('${camelCased}', component, ${camelCased}Class);\n`
  content += "  },\n"
  content += "};\n\n"
  content += "if (typeof window !== 'undefined' && window.Vue) {\n"
  content += `  window.Vue.use(${camelCased});\n`
  content += "}\n\n"
  content += `export default ${camelCased};\n`

  return content
}

getBaseGlobalsContent = () => {
  let content = "import { VueConstructor } from '@zeedhi/vue'\n\n"
  content += "declare global {\n"
  content += "  interface Window {\n"
  content += "    Vue: VueConstructor\n  }\n}\n"
  return content
}

getBaseVueShimsContent = () => {
  let content = "declare module '*.vue' {\n"
  content += "  import Vue from 'vue';\n"
  content += "  export default Vue;\n}\n"
  return content
}

createEmptyFolder = (dir) => {
  fs.ensureDirSync(dir)
}

createEmptyFile = (dir, content) => {
  fs.writeFile(dir, content, (err) => {
    if(err) console.log(err)
  })
}

createSrc = (dir, name, isVue) => {
  let folderPath = path.resolve(dir, 'src/')
  let content = baseIndex(name)

  createEmptyFolder(folderPath)

  if (isVue) {
    content = baseIndexVue(name)
    createEmptyFile(path.resolve(folderPath, 'globals.d.ts'), getBaseGlobalsContent())
    createEmptyFile(path.resolve(folderPath, 'vue-shims.ts'), getBaseVueShimsContent())
  }

  createEmptyFile(path.resolve(folderPath, 'index.ts'), content)
}

createComponents = (dir, name, isVue) => {
  const folderPath = path.resolve(dir, 'src/components/')
  const camelCased = snakeToCamelCase(name)
  createEmptyFolder(folderPath)
  if (isVue) {
    createEmptyFolder(path.resolve(folderPath, 'vuetify'))
    createEmptyFile(path.resolve(folderPath, `vuetify/${camelCased}.vue`), getBaseComponentContent(camelCased, '../'))
    createEmptyFile(path.resolve(folderPath, `${camelCased}.vue`), getBaseComponentContent(camelCased, './'))
    createEmptyFile(path.resolve(folderPath, `${camelCased}Base.ts`), getBaseClassVueContent(name, camelCased))
  } else {
    createEmptyFile(path.resolve(folderPath, `${camelCased}Class.ts`), getBaseClassContent(camelCased))
    createEmptyFile(path.resolve(folderPath, `I${camelCased}.ts`), getBaseInterfaceContent(camelCased))
  }
}

module.exports = (name, dir, isVue) => {
  createEmptyFolder(dir)
  createSrc(dir, name, isVue)
  createComponents(dir, name, isVue)
}
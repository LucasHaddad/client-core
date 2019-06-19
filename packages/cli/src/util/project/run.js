const editAppVue = require('./editAppVue')
const editZeedhiTs = require('./editZeedhiTs')
const editPackageJson = require('./editPackageJson')

function run(config) {
  try {
    editPackageJson(config)
    editZeedhiTs(config)
    editAppVue(config)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

module.exports = async (config) => {
  return await run(config)
}
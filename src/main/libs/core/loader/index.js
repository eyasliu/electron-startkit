const context = require('./context')
const controller = require('./controller')
const raw = require('./raw')
const preload = require('./preload')

const loaderMap = {
  context,
  controller,
  raw,
  preload,
}

const addLoader = (name, loader) => {
  if (loaderMap[name]) {
    throw new Error(name + ' loader is already defined.')
  }

  loaderMap[name] = loader
}

/**
 * add new loader
 */
module.exports = app => type => (collect, name) => {
  let loader = loaderMap[type]
  if (!loader) {
    throw new Error(type + ' loader not found.')
  }

  loader = loader(app)

  let result = null
  if (!collect) {
    throw new Error('loader collect invalid')
  } else if (typeof collect === 'function') {
    result = loader(collect)
    app._loaderModules.push(result)
  } else if (typeof collect === 'object') {
    result = {}
    for (let [key, val] of Object.entries(collect)) {
      result[key] = loader(val)
      app._loaderModules.push(result[key])
    }
  } else {
    result = collect
    app._loaderModules.push(result)
  }

  if (name) {
    app.$set(name, result) 
  }
}

module.exports.addLoader = addLoader

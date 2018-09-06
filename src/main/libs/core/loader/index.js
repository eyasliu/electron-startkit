const context = require('./context')
const controller = require('./controller')
const raw = require('./raw')
const preload = require('./preload')
const store = require('./store')

const loaderMap = {
  context,
  controller,
  raw,
  preload,
  store,
}

/**
 * 增加新的 loader
 * @param {string} name 名字
 * @param {Function} loader 函数
 */
const addLoader = (name, loader) => {
  if (loaderMap[name]) {
    throw new Error(name + ' loader is already defined.')
  }

  loaderMap[name] = loader
}


/**
 * 暴露多样化的loader接口，统一使用loader的方式
 * 
 * @example 
 * const context = loader(application)('context')
 * context({...services}, 'service')
 * 
 * @param {Application} app 上下文对象
 * @param {string} type loader 名称
 * 
 * @param {any} collect 被loader处理的数据
 * @param {string} name loader处理完后赋值到上下文的变量名称
 * 
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

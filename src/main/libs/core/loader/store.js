/**
 * 全局状态数据
 */

const { Preloader } = require('./common')

class BaseStore {}

class StoreLoader extends Preloader {
  constructor(fn, context) {
    super(new (class Store extends BaseStore {})())

    this.context = context
    this.handler = fn
  }
  initialize() {
    delete this.instence.init

    const config = this.handler(this.context)
    if (config.mixin) {
      Object.assign(config, config.mixin)
    }
    delete config.mixin
    for (let [key, val] of Object.entries(config)) {
      if (key === 'data') {
        this.setData(val)
      } else if (key === 'computed' || key === 'computeds') {
        this.setComputed(val)
      } else if (key === 'method' || key === 'methods') {
        this.setMethod(val)
      } else {
        this.instence[key] = val
      }
    }
    if (this.instence.init) {
      this.instence.init(this.context)
    }
  }

  setData(collect) {
    Object.assign(this.instence, collect)
  }

  setComputed(collect) {
    for (let [key, val] of Object.entries(collect)) {
      if (typeof val !== 'function') {
        this.instence[key] = val
        continue
      }

      Object.defineProperty(this.instence, key, {
        get: () => {
          return val.call(this.instence)
        },
        set: () => {
          throw new Error('Can not set framework attributes')
        }
      })
    }
  }

  setMethod(collect) {
    for (let [key, handler] of Object.entries(collect)) {
      if (typeof handler !== 'function') {
        continue
      }
      // this.instence[key] = handler.bind(this.instence)
      Object.defineProperty(this.instence, key, {
        writable: false,
        enumerable: false,
        value: handler.bind(this.instence)
      })
    }
  }
}

module.exports = app => entity => {
  const loader = new StoreLoader(entity, app)
  return loader.instence
}

const Emmiter = require('events')
const loader = require('./loader')

class Application extends Emmiter {
  constructor() {
    super()
    this.emit('init', this)
    this._loader = loader(this)
  }

  /**
   * use app middleware
   * 
   * @param {Function} middleware fn(app)
   * 
   * @return {Application}
   */
  $use(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('application middleware should be function.')
    }

    middleware(this)
    return this
  }

  $loader(type) {
    return this._loader(type)
  }
  $addLoader(...args) {
    return loader.addLoader.apply(undefined, args)
  }

  $set(key, val) {
    if (!this[key]) {
      throw new Error('conflict app.' + key + ' is already defined.')
    }
    this[key] = val
  }

  /**
   * auto run loader init method
   */
  _autoInit(obj) {
    if (!obj) {
      return
    }
    for (let [key, val] of Object.entries(obj)) {
      if (val && key.indexOf('$') !== 0) {
        if ((val.init) && typeof val.init === 'function') {
          val.init(this)
        }
        if (typeof val === 'object') {
          this._autoInit(val)
        }
      }
    }
  }

  /**
   * start run application
   * 
   * 1. run init method
   * 2. run auth method for adapter
   */
  $start() {
    this._autoInit(this)
  }

}
/**
 * 框架入口，管理各项服务
 */

const controller = require('./parser/controller')
const store = require('./parser/store')
const preParse = require('./parser/pre')
const commonParser = require('./parser/common')

/**
  * @param {object} options 配置项，完整配置：
  */
module.exports = class Core {
  constructor(options) {
    this.basedir = options.basedir
    this.$setProto('_parser', {
      controller,
      store,
      pre: preParse,
      common: commonParser,
      service: preParse
    })
    this.Class = {}
  }

  $initClass() {
    this.Class = {
      Adapter: require('./adapter/base'),
      ClientAdapter: require('./adapter/client'),
      ServerAdapter: require('./adapter/server'),
    }
  }

  $load(prop, entries) {
    if (typeof prop === 'string') {
      if (this[prop]) {
        throw new Error('app.' + prop + 'has been occupied for others usage.')
      }
      this[prop] = typeof entries === 'function' ? entries(this) : entries
    } else if (typeof entries === 'function') {
      entries(this)
    }
  }

  $use(fn) {
    fn(this)
  }

  $parser(parserName, entries) {
    const parser = this._parser[parserName](this)
    const parsed = {}
    for (let [key, val] of Object.entries(entries)) {
      parsed[key] = parser(val, key)
    }

    return parsed
  }

  $initialize(obj = this) {
    if (!obj) {
      obj = this
    }
    for (let [key, val] of Object.entries(obj)) {
      if (val && key.indexOf('$') !== 0) {
        if ((val.init) && typeof val.init === 'function') {
          val.init(this)
        }
        if (typeof val === 'object') {
          this.$initialize(val)
        }
      }
    }
  }

  $setProto(key, val) {
    Object.getPrototypeOf(this)[key] = val
  }

  $clear() {
    
  }
}

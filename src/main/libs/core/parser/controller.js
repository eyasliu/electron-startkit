/**
 * 组织业务逻辑代码
 */

class BaseController {}

class Parser {
  constructor(fn, context, name) {
    this.instence = new (class Controller extends BaseController {})()
    this.$context = context
    this.$handler = fn
    this.name = name
    this.$setInit()
  }
  $initialize() {
    delete this.instence.init

    const config = this.$handler(this.$context)
    if (config.mixin) {
      Object.assign(config, config.mixin)
    }
    delete config.mixin
    for (let [key, val] of Object.entries(config)) {
      if (key === 'data') {
        this.instence[key] = val || {}
      } else if (typeof val === 'function') {
        this.instence[key] = val.bind(this.instence)
      } else {
        this.instence[key] = val
      }
    }
    if (this.instence.init) {
      this.instence.init(this.$context)
    }
  }

  $setInit() {
    this.instence.init = this.$initialize.bind(this)
  }

  $setProto(key, val) {
    Object.getPrototypeOf(this)[key] = val
  }
}

module.exports = context => (fn, name) => {
  const controllerName = name || fn.name || 'AnonymousController'
  const controller = new Parser(fn, context, controllerName)
  return controller.instence
}

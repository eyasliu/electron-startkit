/**
 * 组织业务逻辑代码
 */

const { Preloader } = require('./common')

class BaseController {}

class ControllerLoader extends Preloader {
  constructor(fn, context) {
    super(new (class Controller extends BaseController {})())

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
        this.instence[key] = val || {}
      } else if (typeof val === 'function') {
        this.instence[key] = val.bind(this.instence)
      } else {
        this.instence[key] = val
      }
    }
    if (this.instence.init) {
      this.instence.init(this.context)
    }
  }
}

module.exports = app => entity => {
  const loader = new ControllerLoader(entity, app)
  return loader.instence
}

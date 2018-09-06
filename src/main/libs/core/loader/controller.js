/**
 * 组织业务逻辑代码
 */

const { Preloader } = require('./util')

class BaseController {}

/**
 * controller loader
 * 
 * 1. 先定义一个空的 Controller
 * 2. 在自动执行init函数的时候才把controler的真实的类 api 拼回去
 */
class ControllerLoader extends Preloader {
  constructor(fn, context) {
    const instence = new (class Controller extends BaseController {})()
    super(instence)

    this.context = context
    this.handler = fn
  }
  
  /**
   * 拼好 Controller 的真实 api
   */
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

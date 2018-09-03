const Router = require('./router')

let adapterID = 1

module.exports = class BaseAdapter {
  constructor() {
    this.adapterID = adapterID++
    this.name = ''

    this.requestMiddleware = []
    this.responseMiddleware = []

    this.router = new Router({
      adapter: this
    })

    this.routerHandler = this.router.onData
  }

  async onData(data) {
    const requestRawData = data
    // reduce request middleware
    const requestData = this.requestMiddleware.reduce((prev, next) => {
      return next(prev) || prev
    }, requestRawData)
    const responseRawData = await this.routerHandler(requestData)

    // reduce response middleware
    const responseData = this.responseMiddleware.reduce((prev, next) => {
      return next(prev) || prev
    }, responseRawData)

    return responseData
  }

  useRequest(fn) {
    if (typeof fn !== 'function') {
      throw new Error('adapter middleware should be function.')
    }
    this.requestMiddleware.push(fn.bind(this))
  }

  useResponse(fn) {
    if (typeof fn !== 'function') {
      throw new Error('adapter middleware should be function.')
    }
    this.responseMiddleware.push(fn.bind(this))
  }

  routes(routes, parser) {
    this.router.set({
      routes,
      parser,
    })
  }

  _getSeqno() {
    return Math.random().toString(36).substr(2)
  }

  send(cmd, data) {
    let option = null

    if (typeof cmd === 'string') {
      option = {
        cmd,
        data: data || {}
      }
    } else if (cmd && typeof cmd === 'object') {
      option = {
        ...cmd
      }
    } else {
      throw new Error('send argument error.')
    }

    option.seqno = option.seqno || this._getSeqno

    this.sendHandler(option)
  }

  /**
   * 扩展功能，为adapter添加扩展工具函数
   * @param {object} helpers 函数map对象
   */
  extends(helpers) {
    for (let [key, fn] of Object.entries(helpers)) {
      if (this[key]) {
        throw new Error(`${this.name} 扩展 ${key} 因为名字冲突导致失败`)
      }
      this[key] = fn.bind(this)
    }
  }
}

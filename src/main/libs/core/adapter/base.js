const Router = require('./router')

let adapterID = 1

module.exports = class BaseAdapter {
  constructor() {
    this.adapterID = adapterID++
    this.name = ''

    this.dataHandlers = []

    this.router = new Router({
      adapter: this
    })

    this.routerHandler = this.router.onData
  }

  onData(data) {
    this.dataHandlers.forEach(f => f(data))
    return this.routerHandler(data)
  }

  addDataHandler(fn) {
    if (!fn || typeof fn !== 'function') {
      throw new Error('dataHandler should be function')
    }

    this.dataHandlers.push(fn)
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

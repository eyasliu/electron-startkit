const Router = require('./router')

let adapterID = 1

/**
 * 适配器层
 * 
 * 与其他服务或进程的数据交换都通过适配器
 * 
 * base 是所有适配器的父类，定义了一个适配器至少该有的功能
 */
module.exports = class BaseAdapter {
  constructor() {
    this.adapterID = adapterID++ 
    this.name = ''

    this.requestMiddleware = [] // 其他服务进入适配器的数据成为请求(request), 数据请求的中间件
    this.responseMiddleware = [] // 由适配器发送出去的数据称为回应(response), 数据回应的中间件

    // 一个适配器绑定一个路由
    this.router = new Router({
      adapter: this
    })
    this.routerHandler = this.router.onData
  }

  /**
   * 数据在适配器层流动处理
   * @param {object} data 请求进来的数据
   */
  async onData(data) {
    const requestRawData = data
    // reduce request middleware，得到中间件处理后的数据
    const requestData = this.requestMiddleware.reduce((prev, next) => {
      return next(prev) || prev
    }, requestRawData)

    // 再给路由处理业务逻辑
    const responseRawData = await this.routerHandler(requestData)

    // reduce response middleware，回应的时候再走一遍回应中间件处理数据
    const responseData = this.responseMiddleware.reduce((prev, next) => {
      return next(prev) || prev
    }, responseRawData)

    return responseData
  }

  /**
   * 增加请求中间件
   * 
   * @param {Function} fn 中间件函数
   */
  useRequest(fn) {
    if (typeof fn !== 'function') {
      throw new Error('adapter middleware should be function.')
    }
    this.requestMiddleware.push(fn.bind(this))
  }

  /**
   * 增加回应的中间件
   * @param {Function} fn 中间件函数
   */
  useResponse(fn) {
    if (typeof fn !== 'function') {
      throw new Error('adapter middleware should be function.')
    }
    this.responseMiddleware.push(fn.bind(this))
  }

  /**
   * 给路由增加映射处理函数
   * @param {object} routes key 是 路由名称，由 paser 返回的数据，value 是处理函数
   * @param {Function} parser 解析数据得到路由名称
   */
  routes(routes, parser) {
    this.router.set({
      routes,
      parser,
    })
  }

  /**
   * 生成一个请求的标识符
   */
  _getSeqno() {
    return Math.random().toString(36).substr(2)
  }

  /**
   * 从适配器发送数据，兼容两种用法，这里只作为封装用途，使得所有适配的调用方法一致
   * 
   * @example send('login', {...data})
   * @example 
   * send({
   *   cmd: 'login',
   *   data: { ...data }
   * })
   * 
   * @param {object|string} cmd 路由名称，或者路由数据对象
   * @param {object} data 路由数据对象
   * @param  {...any} args 扩展参数，为子类备用
   */
  async send(cmd, data, ...args) {
    let option = null

    if (typeof cmd === 'string') {
      // compatible send('login', {...data})
      option = {
        cmd,
        data: data || {}
      }
    } else if (cmd && typeof cmd === 'object') {
      // compatible send({
      //   cmd: 'login',
      //   data: { ...data }
      // })
      option = {
        ...cmd
      }
      args.unshift(data)
    } else {
      throw new Error('send argument error.')
    }

    option.seqno = option.seqno || this._getSeqno

    const resdata = await this.sendHandler.apply(this, [option, ...args])

    // 回应中间件处理一遍
    const responseData = this.responseMiddleware.reduce((prev, next) => {
      return next(prev) || prev
    }, resdata)

    return responseData
  }

  /**
   * 真正处理发送的函数，由子类实现
   * @param {object} body 数据对象
   */
  sendHandler(body) {
    throw new Error('Sub Class not impleament sendHandler(body)')
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

const Emmiter = require('events')
const Router = require('./router')
const utils = require('../utils')

let adapterID = 1

/**
 * 适配器层
 * 
 * 与其他服务或进程的数据交换都通过适配器
 * 
 * base 是所有适配器的父类，定义了一个适配器至少该有的功能
 * @constructor 
 */
module.exports = class BaseAdapter extends Emmiter {
  constructor() {
    super()
    this.adapterID = adapterID++ 
    this.name = ''

    this.requesTimeout = 10000
    this.cmdIsSeqno = false // 如果为 true 则用 cmd 作为唯一标识符，否则是 seqno，默认 false
    this._defaultIgnoreRequest = false

    this.requestMiddleware = [] // 其他服务进入适配器的数据成为请求(request), 数据请求的中间件
    this.responseMiddleware = [] // 由适配器发送出去的数据称为回应(response), 数据回应的中间件

    this._sendProcessMap = new Map()

    // 一个适配器绑定一个路由
    this.router = new Router({
      adapter: this
    })
    this.routerHandler = this.router.onData
    this.useResponse(this._notifyRouterManualSend.bind(this))
    this.useRequest(this._handlerSendProcess.bind(this))
    this.emit('adapter.instence', this)
  }

  /**
   * 通过手动执行 send 方法回应数据的方式，也要告诉路由，因为路由那边可能还在等待，时间长了路由会超时，触发超时会导致意料之外的问题
   */
  _notifyRouterManualSend(data) {
    this.router.adapterManualSend(data)
  }

  /**
   * send 调用后会等待返回，这里监听所有的回应，看看有没有send过来的
   */
  _handlerSendProcess(data) {
    const seqno = this._getReqSeqno(data)

    if (this._sendProcessMap.has(seqno)) {
      const [resolve] = this._sendProcessMap.get(seqno)
      resolve(data)
    }
  }
  _getReqSeqno(data) {
    return this.cmdIsSeqno ? data.cmd : data.seqno
  }

  /**
   * 数据在适配器层流动处理，会自动应用路由和中间件
   * @param {object} data 请求进来的数据
   */
  async onData(data) {
    const requestRawData = data
    // reduce request middleware，得到中间件处理后的数据
    const requestData = this._applyRequestMdl(requestRawData)

    // 再给路由处理业务逻辑
    const responseRawData = await this.routerHandler(requestData)

    // reduce response middleware，回应的时候再走一遍回应中间件处理数据
    const responseData = this._applyResponseMdl(responseRawData)

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
  _applyRequestMdl(data) {
    return this.requestMiddleware.reduce((prev, next) => {
      return next(prev) || prev
    }, data)
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
  _applyResponseMdl(data) {
    return this.responseMiddleware.reduce((prev, next) => {
      return next(prev) || prev
    }, data)
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
   * @example
   * send('login', {...data})
   *
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

    // 回应中间件处理一遍
    // TIPS: 这里叫发给别的服务，所以叫做 response，要应用 回应中间件
    const resdata = this._applyResponseMdl(option)

    const responseData = await this.sendProgress(...[resdata, ...args])

    // TIPS: 从别的服务发过来的回应数据，叫作请求，应用请求中间件
    const result = this._applyRequestMdl(responseData)
    return result
  }

  /**
   * 发送的通用逻辑
   * @param {object} body 发送的原始对象
   */
  sendProgress(body) {
    let {
      hackCmd = this.cmdIsSeqno,
      cmd, 
      resCmd = body.cmd, // 回应的 cmd ，只有当 hackCmd 或者 this.cmdIsSeqno 为 true 的时候生效
      seqno, 
      timeout: requesTimeout = this.requesTimeout, // 请求超时时间
      extra, // 扩展数据，回应数据的时候会自动带上
      delay,
      ignore = this._defaultIgnoreRequest, // 忽略回应，不等待回应数据
    } = body

    if (hackCmd) {
      seqno = resCmd
    }

    const pack = this.msgPackEncode(body)

    return new Promise(async (resolve, reject) => {
      if (Number(delay)) {
        await utils.sleep(delay)
      }

      this.sendHandler(body, pack)
      if (ignore || (hackCmd && !seqno)) {
        resolve()
        return   
      }

      // 发送超时
      const timer = setTimeout(() => {
        reject(new Error(this.name + ' send timeout: ' + cmd))
        this._sendProcessMap.delete(seqno)
      }, requesTimeout)

      // 正常回应
      const resolveResponse = body => {
        if (extra) {
          body.extra = extra
        }
        clearTimeout(timer)
        this._sendProcessMap.delete(seqno)
        resolve(body)
      }

      this._sendProcessMap.set(seqno, [resolveResponse, reject])
    })
  }

  /**
   * 真正处理发送的函数，由子类实现
   * @param {object} body 数据对象
   * @param {Buffer} pack 数据对象
   */
  sendHandler(body) {
    throw new Error('Sub Class not impleament sendHandler(buffer)')
  }

  /**
   * 解析收到的数据包，由子类实现
   * @param {Buffer} buffer 收到的数据包
   * 
   * @return {Array} 解析好的数据数组
   */
  msgPackDecode(buffer) {
    throw new Error('Sub Class not impleament msgPackDecode(buffer)')
  }
  msgPackEncode(body) {
    throw new Error('Sub Class not impleament msgPackEncode(body)')
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

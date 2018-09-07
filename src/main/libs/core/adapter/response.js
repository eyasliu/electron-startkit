const Emmiter = require('events')
const defaultMsg = 'route is not found.'
const defaultStatus = 404
const defaultBody = {
  error: 'Error: route is not found'
}

const timeoutBody = {
  error: 'Error: gateway timeout 504'
}

/**
 * 适配器数据回应类
 * 
 * @约定 status 使用 http 的状态码，表示回应状态
 */
class Response extends Emmiter {
  constructor(req) {
    super()
    this.request = req
    this.cmd = req.cmd
    this.seqno = req.seqno

    /**
     * 最初始的默认状态应该是 404
     */
    this.status = defaultStatus
    this.body = defaultBody
    this.msg = defaultMsg
    this.requestMaxTime = req.timeout
    this.isResolve = false

    this.done = this._done.bind(this)
    this.cancel = this._cancel.bind(this)
  }

  /**
   * 设置一下默认的成功返回状态
   */
  setDefaultOk() {
    if (this.status === defaultStatus) {
      this.status = 200
    }
  
    if (this.msg === defaultMsg) {
      this.msg = 'ok'
    }

    if (this.body === defaultBody) {
      this.body = {}
    }
  }

  // 通知已处理
  _done() {
    this.emit('send')
    this.isResolve = true
  }

  _cancel() {
    this.emit('cancel')
  }

  // 通知超时
  _timeout() {
    this.msg = 'timeout'
    this.status = 504
    this.body = timeoutBody
    this.send()
  }

  /**
   * 等到通知成功或者失败
   */
  awaitSend() {
    if (this.isResolve) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this._timeout()
      }, this.requestMaxTime)

      this.on('send', () => {
        resolve()
        this.isResolve = true
        clearTimeout(timer)
      })
      this.on('cancel', () => {
        reject(new Error('cancel'))
        clearTimeout(timer)
      })
    })
  }

  /**
   * 序列化回应数据，获取回应数据
   * 
   * @return {object}
   */
  toJSON() {
    return {
      msg: this.msg,
      status: this.status,
      cmd: this.cmd,
      seqno: this.seqno,
      body: this.body
    }
  }
}

/**
 * 使得回应可以扩展，比如需要增加 send(), ok(), json(), notfound() 之类的快捷工具
 * @param {object} mixin 扩展函数集合
 */
Response.extends = (mixin) => {
  for (let [key, val] of Object.entries(mixin)) {
    Response.prototype[key] = val
  }
}

module.exports = Response

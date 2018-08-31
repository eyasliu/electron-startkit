import { ipcRenderer } from 'electron'

class IPC {
  constructor() {
    this.instence = null
    this.builtInChannel = ['async'] // 内置默认启动的 channel
    this.defaultChannel = 'async'

    this.send = this.sendAsync
    this.builtInChannel.forEach(channel => {
      this.init(channel)
    })
  }

  listenerFuncs = {} // ipc 有数据返回时触发的函数, { channel: [fncs] }
  asyncRequestTimeout = 5000 // 异步请求超时时间
  
  sendModlistener = {} // 使用 send() 监听的对象, { cmd: func }
  onModListener = {} // 使用 on() 监听的对象, { cmd: func }

  // 生成请求id，请求的唯一标识符
  _getRequestId(res) {
    return res.cmd + '-' + res.seqno
  }
  // 验证请求数据
  _validate(data) {
    if (!data.cmd) {
      throw new Error('require cmd')
    }

    return true
  }
  _getChannelListener(channel = this.defaultChannel) {
    if (!this.listenerFuncs[channel]) {
      this.listenerFuncs[channel] = []
    }
    return this.listenerFuncs[channel]
  }

  /**
   * 初始化 ipc 监听 channel 频道，只有初始化过得频道才能使用 sendAsync、on、register 等实例方法
   * 
   * @param {string} channel 频道名称
   */
  init(channel) {
    ipcRenderer.on(channel, (event, res) => {
      const funcs = this.listenerFuncs[channel]
      if (Array.isArray(funcs)) {
        funcs.forEach(fn => fn.call(this, res))
      }
    })
    this.register(this._asyncReqHandler, channel)
    this.register(this._onHandler, channel)
  }

  /**
   * 在频道注册一个监听函数
   * @param {Function} func 监听函数
   * @param {string} channel 频道名称，默认为 'asynchronous-reply'
   */
  register = (func, channel = this.defaultChannel) => {
    const listeners = this._getChannelListener(channel)
    listeners.push(func)
  }
  /**
   * 在 channel 频道注销监听函数
   * @param {Function} func 监听函数
   * @param {string} channel 频道名称，默认为 'asynchronous-reply'
   */
  unregister = (func, channel = this.defaultChannel) => {
    const listeners = this._getChannelListener(channel)
    const index = listeners.indexOf(func)
    if (~index) {
      listeners.splice(index, 1)
    }
  }
  /** ************************ on Mode start ************************************/
  _onHandler(res) {
    const cmd = res.cmd
    if (cmd && this.onModListener[cmd]) {
      this.onModListener[cmd].forEach(fn => fn.call(this, res))
    }
  }
  /**
   * 监听返回数据的 cmd ，触发对应函数，全频道生效
   * @param {string} cmd 命令名称
   * @param {Function} func 回调函数
   */
  on = (cmd, func) => {
    const fns = this.onModListener[cmd] || []
    fns.push(func)
    this.onModListener[cmd] = fns
  }
  /**
   * 注销 cmd 的回调函数
   * @param {string} cmd 命令名称
   * @param {Function} func 回调函数
   */
  off = (cmd, func) => {
    if (!func) {
      delete this.onModListener[cmd]
      return
    }
    const fns = this.onModListener[cmd]
    if (Array.isArray(fns)) {
      const index = fns.indexOf(func)
      if (~index) {
        fns.splice(index, 1)
        if (fns.length) {
          this.onModListener[cmd] = fns
        } else {
          delete this.onModListener[cmd]
        }
      }
    } 
  }
  /** ************************ on Mode End************************************/

  /** ************************ send Mode Start************************************/
  _asyncReqHandler(res) {
    const reqid = this._getRequestId(res)

    if (this.sendModlistener[reqid]) {
      const resolves = this.sendModlistener[reqid]
      let resolve = null

      if (Array.isArray(resolves)) {
        resolve = resolves.shift()
        if (resolves.length) {
          this.sendModlistener[reqid] = resolves
        } else {
          delete this.sendModlistener[reqid]
        }
      } else {
        resolve = resolves
      }

      resolve(res)
    }
  }

  /**
   * 向 IPC 发送异步请求，并获取应答数据
   * @param {object} _req 请求数据
   * @param {boolean} noResponse 是否不需要等待返回数据，默认需要
   * @param {string} channel ipc 频道
   * 
   * @return {Promise|Error} Object 返回对象
   */
  sendAsync = (_req, noResponse = false, channel = 'async') => {
    const req = { ..._req }
    req.seqno = req.seqno || Math.random().toString(36).substr(2, 4)
    req.body = req.body || {}

    const err = this._validate(_req)
    if (err !== true) {
      return Promise.reject(err)
    }
    
    return new Promise((resolve, reject) => {
      ipcRenderer.send(channel, req)
      
      if (noResponse) {
        resolve()
        return
      }
      
      const reqid = this._getRequestId(req)

      // if (this.sendModlistener[reqid]) {
      // 成功的回调
      let resolveHander = (res) => {
        resolve(res)
        clearTimeout(timeout)
      }

      // 超时失败
      const timeout = setTimeout(() => {
        reject(new Error('ipc timeout:' + reqid))

        const resolves = this.sendModlistener[reqid] || []
        const index = resolves.indexOf(resolveHander)
        if (~index) {
          resolves.splice(index, 1)
        }
        if (resolves.length) {
          this.sendModlistener[reqid] = resolves
        } else {
          delete this.sendModlistener[reqid]
        }
      }, this.asyncRequestTimeout)

      const resolves = this.sendModlistener[reqid] || []

      resolves.push(resolveHander)
      this.sendModlistener[reqid] = resolves
      // }
    })
  }

  /** ************************ send Mode End************************************/

  /**
   * 向 ipc 发送同步请求，并获取应答数据
   * @param {object} req 请求数据
   * @param {string} channel 频道名称
   * 
   * @return {Promise|Error} Object 返回对象
   */
  sendSync = async (_req, channel = 'sync') => {
    const req = { ..._req }
    req.seqno = req.seqno || Math.random().toString(36).substr(2, 4)
    req.body = req.body || {}

    await this._validate(req)

    const res = ipcRenderer.sendSync(channel, req)
    if (typeof res === 'string') {
      var result = JSON.parse(res)
      return result
    } else {
      return res
    }
  }
}

const ipc = new IPC()

export default ipc
export const sendAsync = ipc.sendAsync
export const sendSync = ipc.sendSync

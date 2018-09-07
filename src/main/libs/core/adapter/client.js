const net = require('net')
const Adapter = require('./base')

module.exports = class ClientAdapter extends Adapter {
  constructor(options) {
    super()

    if (!options.host || !options.port) {
      throw new Error('client adapter options required host & port')
    }

    this.name = options.name || `Client ${this.adapterID}`
    this.host = options.host
    this.port = options.port

    this._reconnectTimeout = 1000 // 自动重连间隔时间
  }

  init() {
    this._connect()
  }

  /**
   * 客户端验证，由子类实现，默认行为是不验证
   * 
   * @return {Promise|boolean} 验证结果 bool 值
   */
  auth() {
    return true
  }

  /**
   * 如何发送心跳，由子类实现，默认行为是不发送
   */
  heartbeat() {}

  // 解析收到的数据包
  _paseBody(buffer) {}

  /**
   * 连接 socket 服务器
   */
  _connect() {
    // this.emit('adapter.initconnect')
    this.instence = net.connect(this.port, this.host)
    this._socketEvents(this.instence)
    return this.instence
  }

  _reconnect() {
    this.instence && this.instence.destroy()
    this._connect()
  }

  /**
   * 监听 socket 事件
   * @param {Socket} connect 连接实例
   */
  _socketEvents(connect) {
    connect.on('connect', this._onConnect.bind(this))
    connect.on('data', this._onMessage.bind(this))
    connect.on('timeout', this._onTimeout.bind(this))
    connect.on('error', this._onError.bind(this))
    connect.on('end', this._onEnd.bind(this))
    connect.on('close', this._onClose.bind(this))
  }

  /**
   * socket 连接
   */
  _onConnect() {
    this.emit('adapter.connect')
  }

  /**
   * socket 收到数据包
   */
  _onMessage(pack) {
    const datas = this.msgPackDecode(pack)
    datas.forEach(data => this.onData(data))

    // this.emit('adapter.message', err) // 这个事件太频繁了，担心会有性能问题，就不发事件了, 想要处理的话改用中间件吧 useRequest(fn)
  }

  /**
   * socket 连接超时
   */
  _onTimeout() {
    this.emit('adapter.timeout')
  }

  /**
   * socket 连接错误
   */
  _onError(err) {
    this.emit('adapter.error', err)
  }

  /**
   * socket 连接结束
   */
  _onEnd() {
    this.emit('adapter.end')
  }

  /**
   * socket 连接关闭
   */
  _onClose() {
    this.emit('adapter.close')

    setTimeout(() => {
      this._reconnect()
    }, this._reconnectTimeout)
  }
}

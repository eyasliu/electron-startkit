const net = require('net')
const Adapter = require('./base')
const url = require('url')

module.exports = class TCPClient extends Adapter {
  constructor(options) {
    super(options)

    const urlParse = url.parse(options.uri || options.url)

    // if (!options.host || !options.port) {
    //   throw new Error('client adapter options required host & port')
    // }
    this.name = options.name || `Client ${this.adapterID}`
    this.host = options.host || urlParse.hostname
    this.port = options.port || urlParse.port
    this.heartbeat = options.heartbeat
    this.heartbeatInteval = options.heartbeatInteval || 5000
    this.auth = options.auth || this.auth

    this.packer = options.packer || this.packer
    this.parser = options.parser || this.parser

    this._reconnectTimeout = 1000 // 自动重连间隔时间

    this.instence = null
    this.isAuth = false
  }

  init() {
    this._connect()
  }

  auth() {
    return true
  }

  /**
   * 将请求数据转化成要发送的 buffer, 这里是默认值
   * @param {object} body 请求数据
   * 
   * @return {Buffer}
   */
  packer(body) {
    return Buffer.from(JSON.stringify(body))
  }

  /**
   * 将服务器发过来的数据包解析成真实数据，这里要处理tcp的粘包、半包、连包问题
   * 
   * @param {Buffer} buffer 收到的数据包
   * @return {Array} 解析到的数据
   */
  parser(buffer) {
    return []
  }

  sendHandler(body, pkg) {
    this.instence.write(pkg)
  }

  _startHeartbeat() {
    if (this.heartbeat) {
      this._heartbeatTimer = setInterval(() => {
        this.heartbeat(this)
      }, this.heartbeatInteval)
    }
  }
  _stopHeartbeat() {
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer)
    }
  }

  _resetState() {
    this.instence && this.instence.destroy()
    this.instence = null
    this._heartbeatTimer && clearInterval(this._heartbeatTimer)
    this._heartbeatTimer = null
    this.isAuth = false
  }
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
    this._resetState()
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
  async _onConnect() {
    this.emit('adapter.connect')
    this._startHeartbeat()
    const res = await this.auth(this)
    this.isAuth = res
  }

  /**
   * socket 收到数据包
   */
  _onMessage(pack) {
    const datas = this.parser(pack) || []
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
    this._resetState()
    // 断开重连
    setTimeout(() => {
      this._reconnect()
    }, this._reconnectTimeout)
  }
}

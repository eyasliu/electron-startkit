const Emmiter = require('events')
const loader = require('./loader')

/**
 * 应用的上下文对象，整个应用的数据和函数工具都会放在这里，要什么东西直接从这里拿，
 * 推荐用对象解构的形式按需读取数据
 */
class Application extends Emmiter {
  constructor() {
    super()
    this.emit('load', this)

    this._class()
    this._loader = loader(this)
    this._loaderModules = []
  }

  /**
   * 一部分内核定义的类，需要在外面初始化，统一先放到 Class 变量中
   */
  _class() {
    this.Class = {
      Adapter: require('./adapter/base'),
      TCPClient: require('./adapter/tcpclient'),
      TCPServer: require('./adapter/tcpserver'),
      IPC: require('./adapter/ipc'),
      Request: require('./adapter/request'),
      Response: require('./adapter/response'),
      Window: require('./window'),
      Updater: require('./updater'),
      Hprose: require('./hprose')
    }
  }

  /**
   * use app middleware
   * 
   * @param {Function} middleware fn(app)
   * 
   * @return {Application}
   */
  $use(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('application middleware should be function.')
    }

    middleware(this)
    return this
  }

  /**
   * 使用 loader 解析
   */
  $loader(type) {
    return this._loader(type)
  }

  /**
   * 添加自定义的loader
   */
  $addLoader(...args) {
    return loader.addLoader.apply(undefined, args)
  }

  /**
   * 安全的设置一个上下文变量
   * @param {string} key 
   * @param {any} val 
   */
  $set(key, val) {
    if (this[key]) {
      throw new Error('conflict app.' + key + ' is already defined.')
    }
    this[key] = val
  }

  /**
   * 对于用loader 处理过的东西，如果有init函数都会自动执行一次
   */
  async _autoInit() {
    this.emit('beforeInit', this)

    this._loaderModules.forEach(entity => {
      if (entity && (entity.init) && typeof entity.init === 'function') {
        entity.init(this)
      }
    })

    this.emit('afterInit', this)
  }

  /**
   * start run application
   * 
   * 1. run init method
   * 2. run auth method for adapter
   * 3. Run, Barry, run!!!
   */
  $start() {
    this._autoInit(this)
  }
}

module.exports = Application

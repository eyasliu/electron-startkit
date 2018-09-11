/** 
 * 定义 adapter 行为
 */
module.exports = app => {
  const { Class, adapter, log } = app

  /**
   * adapter response helpers
   */
  Class.Response.extends({
    /**
     * 定义回应数据和状态
     * @param {object} body 发送函数
     * @param {string} msg 状态文字
     * @param {number} status 状态码 
     */
    send(body = {}, msg, status) {
      this.setDefaultOk()
  
      this.msg = msg || this.msg
      this.status = status || this.status
  
      this.body = body || this.body
      this.done()
    },
  
    /**
     * 和 send 一样，定制了默认值
     */
    ok(body = {}, msg = 'ok', status = 200) {
      this.send(body, msg, status)
    },
    
    /**
     * 和 send 一样，定制了默认值
     */
    notfound(body = {}, msg = 'route not found.', status = 404) {
      this.send(body, msg, status)
    },

    /**
     * 和 send 一样，定制了默认值
     */
    serverError(body = {}, msg = 'server error.', status = 500) {
      this.send(body, msg, status)
    },
  })

  /**
   * logger request / response
   */
  const accessLog = type => name => _data => {
    if (_data.log === false) {
      return _data
    }
    const data = { ..._data }
    const dataField = data.data ? 'data' : 'body'
    const bodyStr = JSON.stringify(data.data || data.body || '{}')
    if (bodyStr.length > 300) {
      data[dataField] = bodyStr.substring(0, 300) + '......'
    }
    log.info(`${name} ${type === 0 ? '==>' : '<=='} ${JSON.stringify(data).replace(/\\/g, '')}`)
  }

  for (let [key, ad] of Object.entries(adapter)) {
    const name = ad.name || key
    ad.useRequest(accessLog(1)(name))
    ad.useResponse(accessLog(0)(name))
    /**
     * adapter event listen to logger
     */

    if (ad instanceof Class.TCPServer) {
      // server
      ad.on('adapter.server.listening', () => {
        log.info(`adapter ${name} is successfully listening.`)
      })
      ad.on('adapter.server.close', () => {
        log.info(`adapter ${name} is close.`)
      })
      // ad.on('adapter.server.connection', () => {
      //   log.info(`adapter ${name} is successfully listening.`)
      // })
      ad.on('adapter.server.error', (err) => {
        log.error(`adapter ${name} had error, ${err}.`)
      })

      // client socket
      ad.on('adapter.connect', (socket) => {
        log.info(`adapter ${name} socketID=${socket.socketID} is connected.`)
      })
      ad.on('adapter.timeout', (socket) => {
        log.warn(`adapter ${name} socketID=${socket.socketID} is timeout.`)
      })
      ad.on('adapter.error', (socket, err) => {
        log.error(`adapter ${name} socketID=${socket.socketID} is error. ${err}`)
      })
      ad.on('adapter.end', (socket) => {
        log.info(`adapter ${name} socketID=${socket.socketID} is end.`)
      })
      ad.on('adapter.close', (socket, hadError) => {
        if (hadError) {
          log.error(`adapter ${name} socketID=${socket.socketID} is close because of some error.`)
        } else {
          log.info(`adapter ${name} socketID=${socket.socketID} is close.`)
        }
      })
    } else {
      ad.on('adapter.connect', () => {
        log.info(`adapter ${name} is connected.`)
      })
      ad.on('adapter.timeout', () => {
        log.warn(`adapter ${name} is timeout.`)
      })
      ad.on('adapter.error', (err) => {
        log.error(`adapter ${name} is error. ${err}`)
      })
      ad.on('adapter.end', () => {
        log.info(`adapter ${name} is end.`)
      })
      ad.on('adapter.close', (hadError) => {
        if (hadError) {
          log.error(`adapter ${name} is close because of some error.`)
        } else {
          log.info(`adapter ${name} is close.`)
        }
      })
    }
  }

  /**
   * ================================================
   * 
   * User custom adapter middleware
   * 
   * ================================================
   */
  //  adapter.ipc.useRequest(data => {})
  //  adapter.ipc.useResponse(data => {})
}

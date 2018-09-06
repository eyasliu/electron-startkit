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
  const requestLog = name => data => {
    log.info(`${name} <== ${JSON.stringify(data)}`)
  }
  
  const responseLog = name => data => {
    log.info(`${name} ==> ${JSON.stringify(data)}`)
  }

  for (let [key, ad] of Object.entries(adapter)) {
    const name = ad.name || key
    ad.useRequest(requestLog(name))
    ad.useResponse(responseLog(name))
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

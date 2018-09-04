module.exports = app => {
  const { Class, adapter, log } = app

  /**
   * adapter response helpers
   */
  Class.Response.extends({
    send(body = {}, msg, status) {
      this.setDefaultOk()
  
      this.msg = msg || this.msg
      this.status = status || this.status
  
      this.body = body || this.body
      this.done()
    },
  
    ok(body = {}, msg = 'ok', status = 200) {
      this.send(body, msg, status)
    },
  
    notfound(body = {}, msg = 'route not found.', status = 404) {
      this.send(body, msg, status)
    },
  
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

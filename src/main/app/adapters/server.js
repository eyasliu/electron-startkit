/**
 * this is a server demo
 */
module.exports = app => {
  class Server extends app.Class.ServerAdapter {
    constructor(options) {
      super(options)
    }


  }

  return new Server({
    host: '0.0.0.0',
    port: 1650
  })
}
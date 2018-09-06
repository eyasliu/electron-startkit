const Adapter = require('./base')

module.exports = class ClientAdapter extends Adapter {
  constructor(options) {
    super()

    if (!options.host || !options.port) {
      throw new Error('client adapter options required host & port')
    }

    this.host = options.host
    this.port = options.port
    
  }

  _connect() {

  }
}
const net = require('net')
const Adapter = require('./base')

let socketID = 1

class ServerAdapter extends Adapter {
  constructor(options) {
    super()
    if (!options.port) {
      throw new Error('server adapter options required port')
    }

    this.name = options.name || `Server ${this.adapterID}`

    this.port = options.port
    this.host = options.host || '127.0.0.1'

    this.instence = null
    this.server = null
    this.sockets = new Map()
  }

  init() {
    this._startServer()
  }

  _heartbeat() {}

  _startServer() {
    this.server = net.createServer()
    this._serverEvents(this.server)
    this.server.listen(this.port, this.host)
  }

  _restartServer() {}

  
  /***********************server events *************************/
  _serverEvents(instence) {
    instence.on('listening', this._onServerListening.bind(this))
    instence.on('connection', this._onServerConnection.bind(this))
    instence.on('error', this._onServerError.bind(this))
    instence.on('close', this._onServerClose.bind(this))
  }
  _onServerListening() {
    this.emit('adapter.server.listening')
  }
  _onServerClose() {
    this.emit('adapter.server.close')
  }
  _onServerConnection(socket) {
    socket.socketID = socketID++
    this.sockets.set(socket.socketID, socket)
    this.emit('adapter.server.connection', socket)
    this.emit('adapter.connect', socket)
    this._socketEvents(socket)
  }
  _onServerError(err) {
    this.emit('adapter.server.error', err)
  }
  /***********************server events end *************************/




  /***********************socket events *************************/
  _socketEvents(socket) {
    // socket.on('lookup', this._onSocketLookup.bind(this, socket))
    socket.on('connect', this._onSocketConnect.bind(this, socket))
    // socket.on('ready', this._onSocketReady.bind(this, socket))
    // socket.on('drain', this._onSocketDrain.bind(this, socket))
    socket.on('data', this._onSocketData.bind(this, socket))
    socket.on('timeout', this._onSocketTimeout.bind(this, socket))
    socket.on('error', this._onSocketError.bind(this, socket))
    socket.on('end', this._onSocketEnd.bind(this, socket))
    socket.on('close', this._onSocketClose.bind(this, socket))
  }

  _onSocketConnect(socket) {
    this.emit('adapter.connect', socket)
  }
  _onSocketData(socket, pack) {
    // this.emit('adapter.data', pack)
  }
  _onSocketTimeout(socket) {
    this.emit('adapter.timeout', socket)
  }
  _onSocketError(socket, err) {
    this.emit('adapter.error', socket, err)
  }
  _onSocketEnd(socket) {
    this.emit('adapter.end', socket)
  }
  _onSocketClose(socket, hadErr) {
    this.emit('close', socket, hadErr)
  }
  
  /***********************socket events end *************************/
  
  _onConnect(socket) {}
}

module.exports = ServerAdapter

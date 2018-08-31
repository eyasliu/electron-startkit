const {
  ipcMain
} = require('electron')
const Adapter = require('./common/base')

class IPC extends Adapter {
  constructor(options) {
    super()
    this.instence = ipcMain

    this.syncChannel = options.syncChannel || []
    this.asyncChannel = options.asyncChannel || []

    this.syncMessage = this.onMessage('sync')
    this.asyncMessage = this.onMessage('async')

    this._init()
  }
  
  _init() {
    this.syncChannel.forEach(channel => this.addChannel(channel, true))
    this.asyncChannel.forEach(channel => this.addChannel(channel))
  }

  onMessage(type) {
    return (event, arg, channel) => {
      const isSync = type === 'sync'
      this.onData(arg)
      this.routerHandler && this.routerHandler(arg).then(res => {
        if (isSync) {
          event.returnValue = res
        } else {
          event.sender.send(channel, res)
        }
      })
    }
  }

  addChannel(channel, isSync = false) {
    this.instence.on(channel, async (e, arg) => {
      const data = {
        ...arg,
      }
      isSync ? this.syncMessage(e, data, channel) : this.asyncMessage(e, data, channel)
    })
  }
}

module.exports = new IPC({
  syncChannel: ['sync'],
  asyncChannel: ['async']
})

const { ipcMain } = require('electron')

module.exports = ({ Class, log, window }) => {
  class IPC extends Class.Adapter {
    constructor(options) {
      super()
      this.instence = ipcMain
      this.name = 'IPC'

      this.defaultChannel = options.defaultChannel
  
      this.syncChannel = options.syncChannel || []
      this.asyncChannel = options.asyncChannel || []
  
      this.syncMessage = this.onMessage(true)
      this.asyncMessage = this.onMessage(false)
  
      this._init()
    }
    
    _init() {
      this.syncChannel.forEach(channel => this.addChannel(channel, true))
      this.asyncChannel.forEach(channel => this.addChannel(channel))
    }
  
    onMessage(isSync) {
      return async (event, arg, channel) => {
        const res = await this.onData(arg)

        if (isSync) {
          event.returnValue = res
        } else {
          event.sender.send(channel, res)
        }
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

    sendHandler(body, channel = this.defaultChannel) {
      window.main.webContents.send(channel, body)
      
      return body
    }
  }

  return new IPC({
    syncChannel: ['sync'],
    asyncChannel: ['async'],
    defaultChannel: 'async'
  })
}

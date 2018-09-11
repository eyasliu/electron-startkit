const Adapter = require('./base')
const { ipcMain } = require('electron')

module.exports = class IPC extends Adapter {
  constructor(options) {
    super(options)
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
      let res
      try {
        res = await this.onData(arg)
      } catch (err) {
        if (err.message === 'Error: cancel') {
          return
        }

        throw err
      }
      
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
        channel,
      }
      isSync ? this.syncMessage(e, data, channel) : this.asyncMessage(e, data, channel)
    })
  }

  sendProgress(body, channel = this.defaultChannel) {
    window.main.webContents.send(channel, body)
    
    return body
  }
}

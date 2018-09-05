/**
 * renderer 窗口管理器
 */
const { app, BrowserWindow } = require('electron')
const windowCurrentSetting = {
  height: 768,
  width: 1024,
  frame: true,
  // useContentSize: true,
}
module.exports = class Window {
  constructor() {
    this._currentWindow = null
    this.instences = []
    this.appEvent()
  }

  get main() {
    return this._currentWindow
  }

  create(config = {}) {
    this._currentWindow = new BrowserWindow({
      ...windowCurrentSetting,
      ...config,
    })

    this.instences.push(this._currentWindow)

    if (config.url) {
      this.loadURL(config.url)
    }

    if (process.env.NODE_ENV === 'development') {
      if (config.devtool) {
        require('electron-debug').openDevTools(this._currentWindow)
      }
    }

    return this._currentWindow
  }

  loadURL(...args) {
    return this.main.loadURL(...args)
  }

  destroy() {}

  message() {}

  appEvent() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }
}

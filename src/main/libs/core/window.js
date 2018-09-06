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
    this.instences = [] // 已经打开的窗口
    this.appEvent()
  }

  /**
   * 获取当前激活的窗口
   */
  get main() {
    return this._currentWindow
  }

  /**
   * 新建一个新的窗口，并打开指定url，并激活
   * @param {string} config.url 新建窗口后自动打开的url
   * @param {...any} config ... 其他 BrowserWindow 的参数
   */
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

  /**
   * BrowserWindow.loadURL 别名
   */
  loadURL(...args) {
    return this.main.loadURL(...args)
  }

  /**
   * 和窗口有关的全局事件监听
   */
  appEvent() {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }
}

/**
 * 自动更新工具
 */
module.exports = class AppUpdater {
  constructor(options) {
    const { autoUpdater } = require('electron-updater')
    // const autoUpdater = new AppUpdater({
    //   autoInstallOnAppQuit: false,
    //   autoDownload: false,
    //   // logger:
    // })
    autoUpdater.quitAndInstallCalled = false
    // autoUpdater.autoDownload = false
    if (options.logger) {
      autoUpdater.logger = options.logger
      // autoUpdater.logger.transports.file.level = 'info'
    }
    autoUpdater.checkForUpdatesAndNotify()
    return autoUpdater
  }
}

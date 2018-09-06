/**
 * 自动更新工具
 */
module.exports = class AppUpdater {
  constructor(options) {
    const { autoUpdater } = require('electron-updater')
    if (options.logger) {
      autoUpdater.logger = options.logger
      // autoUpdater.logger.transports.file.level = 'info'
    }
    autoUpdater.checkForUpdatesAndNotify()
  }
}

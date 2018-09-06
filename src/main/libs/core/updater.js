const { autoUpdater } = require('electron-updater')

module.exports = class AppUpdater {
  constructor(options) {
    if (options.logger) {
      autoUpdater.logger = options.logger
      // autoUpdater.logger.transports.file.level = 'info'
    }
    autoUpdater.checkForUpdatesAndNotify()
  }
}

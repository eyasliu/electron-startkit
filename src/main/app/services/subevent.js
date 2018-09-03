const { app, BrowserWindow } = require('electron')

module.exports = function() {
  let mainWindow = null

  let winURL = `file://${__dirname}/index.html`

  function createWindow () {
    mainWindow = new BrowserWindow({
      height: 563,
      useContentSize: true,
      width: 1000
    })

    if (process.env.NODE_ENV === 'development') {
      const rootConfig = require('@root/scripts/config')
      winURL = `http://localhost:${rootConfig.ports.renderer}`
    }
  
    mainWindow.loadURL(winURL)
  
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', createWindow)
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

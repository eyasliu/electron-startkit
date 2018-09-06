const { app } = require('electron')

module.exports = function({ window }) {
  let winURL = `file://${__dirname}/index.html`

  function createWindow () {
    if (process.env.NODE_ENV === 'development') {
      const rootConfig = require('@root/scripts/config')
      winURL = `http://localhost:${rootConfig.ports.renderer}`
    }
  
    window.create({
      width: 1920,
      height: 1024,
      // frame: false,
      url: winURL,
      devtool: true
    })
  }

  app.on('ready', createWindow)
  
  app.on('activate', () => {
    if (window.main === null) {
      createWindow()
    }
  })
}

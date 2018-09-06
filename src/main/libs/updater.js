module.exports = app => {
  const updater = new app.Class.Updater({
    logger: app.log,
    feedUrl: 'http://localhost'
  })
  app.updater = updater
}

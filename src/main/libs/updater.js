module.exports = app => {
  const updater = new app.Class.Updater({
    logger: app.log,
  })
  app.updater = updater
}

const sqlite = require('sqlite3')
const mkdirp = require('mkdirp')
const path = require('path')

module.exports = app => {
  const config = app.config
  mkdirp.sync(path.dirname(config.sqlitedb))
  
  const db = new sqlite.Database(config.sqlitedb)
  app.db = db
}

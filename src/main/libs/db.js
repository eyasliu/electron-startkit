const sqlite = require('sqlite3')
const mkdirp = require('mkdirp')
const path = require('path')

/**
 * 初始化 sqlite 数据库
 * 
 * 不用担心 sqlite3 安装和 rebuild 问题，electron-builder 已经为我们解决好了
 */
module.exports = app => {
  const config = app.config
  mkdirp.sync(path.dirname(config.sqlitedb))
  
  const db = new sqlite.Database(config.sqlitedb)
  app.db = db
}

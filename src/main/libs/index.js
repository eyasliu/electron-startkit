/**
 * 框架入口
 */
require('./polyfill') // 填充物，你懂得
require('./chromeArgs')
const path = require('path')
const APP = require('@main/libs/core')
const config = require('@root/scripts/config') // 是的，我把配置文件放到很外面了

/* 关掉那几条 warning，反正没用 */
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

const basedir = path.join(__dirname, '../')
const application = new APP({
  basedir: basedir
})

const { modules = {} } = config

// load config
application.config = config

if (modules.logger) {
  // load logger
  application.$use(require('./logger'))
}

if (modules.updater) {
  // load updater
  application.$use(require('./updater'))
}

if (modules.sqlitedb) {
  // load sqlitedb
  application.$use(require('./db'))
}

// load window manager
application.$use(require('./window'))

// load controller, routes, adapter......
application.$use(require('./loader'))

// load adaper
application.$use(require('./adapter'))

// run, electron, run!!!
application.$start()

module.exports = application

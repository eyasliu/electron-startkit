require('./polyfill')
require('./chromeArgs')
const path = require('path')
const APP = require('@main/libs/core')
const config = require('@root/scripts/config')

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

const basedir = path.join(__dirname, '../')
const application = new APP({
  basedir: basedir
})

// load config
application.config = config

// load logger
application.$use(require('./logger'))

// load updater
application.$use(require('./updater'))

// load sqlitedb
application.$use(require('./db'))

// load window manager
application.$use(require('./window'))

// load controller, routes, adapter......
application.$use(require('./loader'))

// load adaper
application.$use(require('./adapter'))

// run, electron, run!!!
application.$start()

module.exports = application

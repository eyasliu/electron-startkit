require('./chromeArgs')
const path = require('path')
const APP = require('@main/libs/core')

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

const basedir = path.join(__dirname, '../')
const application = new APP({
  basedir: basedir
})

// load logger
application.$use(require('./logger'))

// load controller, routes, adapter......
application.$use(require('./loader'))

// load adaper
application.$use(require('./adapter'))

// run, electron, run!!!
application.$start()

module.exports = application

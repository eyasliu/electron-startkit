const path = require('path')
const APP = require('@main/libs/core')

const basedir = path.join(__dirname, '../')

const app = new APP({
  basedir: basedir
})

app.Class.Response.extends(require('./response'))

app.$use(require('./loader'))
app.$start()

module.exports = app

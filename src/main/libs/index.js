const path = require('path')
const APP = require('@main/libs/core')

const app = new APP({
  basedir: path.join(__dirname, '../')
})

app.$use(require('./parser'))
app.$use(require('./router'))

app.$initialize()
app.$clear()

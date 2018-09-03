const init = require('./init')

module.exports = app => {
  // console.log(app)
  init()

  return {
    machine: require('./machine')
  }
}

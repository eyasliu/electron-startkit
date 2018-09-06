require('regenerator-runtime/runtime')
if (process.env.NODE_ENV === 'development') {
  global.Promise = require('bluebird')
  Promise.config({
    longStackTraces: process.env.NODE_ENV === 'development',
    cancellation: true,
  })
}

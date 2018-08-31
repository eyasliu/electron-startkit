module.exports = app => {
  app.$load('controller', app.$groupParse('controller', require('@/controllers')))
  app.$load('service', app.$groupParse('service', require('@/services')))
  app.$load('adapter', require('./adapter'))
  app.$load('routes', app.$groupParse('common', require('@/routes')))
}

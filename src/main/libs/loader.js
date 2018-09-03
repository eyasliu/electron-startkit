module.exports = app => {
  const controller = app.$loader('controller')
  const context = app.$loader('context')
  const preload = app.$loader('preload')
  const store = app.$loader('store')

  context(require('@/adapters'), 'adapter')
  context(require('@/services'), 'service')
  
  controller(require('@/controllers'), 'controller')
  store(require('@/stores'), 'store')
  
  preload(require('@/models'), 'model')
  preload(require('@/routes'))
}

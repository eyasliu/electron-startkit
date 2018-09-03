module.exports = app => {
  const controller = app.$loader('controller')
  const context = app.$loader('context')
  const preload = app.$loader('preload')

  context(require('@/adapters'), 'adapter')
  context(require('@/services'), 'service')
  
  controller(require('@/controllers'), 'controller')
  
  preload(require('@/models'), 'model')
  preload(require('@/routes'))
}

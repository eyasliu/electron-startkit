module.exports = app => {
  const controller = app.$loader('controller')
  const raw = app.$loader('raw')
  const context = app.$loader('context')

  controller(require('@/controllers'), 'controller')

  raw(require('@/adapters'), 'adapter')

  context(require('@/models'), 'model')
  context(require('@/routes'))
  context(require('@/services'), 'service')
}
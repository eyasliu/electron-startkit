/**
 * 加载业务逻辑代码
 * 
 * TIPS: 如果你要加入自己的东西，请注意加载顺序哦
 */
module.exports = app => {
  const controller = app.$loader('controller')
  const context = app.$loader('context')
  const preload = app.$loader('preload')
  const raw = app.$loader('raw')
  const store = app.$loader('store')

  const { modules = {} } = app.config

  raw(require('@/helpers'), 'helper') // 工具函数
  context(require('@/adapters'), 'adapter') // 适配器
  context(require('@/services'), 'service') // service 服务
  
  controller(require('@/controllers'), 'controller') // 控制器
  store(require('@/stores'), 'store') // 数据中心
  
  if (modules.sqlitedb) {
    preload(require('@/models'), 'model') // 数据库数据模型
  }
  preload(require('@/routes')) // 路由
}

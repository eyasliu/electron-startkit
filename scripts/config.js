const path = require('path')

module.exports = {
  ports: {
    renderer: 5890, // 开发阶段前端开发端口号
    main: 5891, // 主进程端口
    mainDebugger: 5892 // 主进程调试端口
  },
  sqlitedb: path.resolve('db/main.db'),
  modules: {
    updater: false,
    sqlitedb: false,
    logger: true
  }
}

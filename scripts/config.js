const path = require('path')

module.exports = {
  ports: {
    renderer: 5890, // 开发阶段前端开发端口号
    main: 5891, // 主进程端口
    mainDebugger: 5892 // 主进程调试端口
  },
  sqlitedb: path.resolve('db/main.db'),
  modules: {
    updater: false, // npm install -D electron-updater
    sqlitedb: false, // npm install -S sqlite3
    logger: true, // npm install -D winston
    hprose: true, // npm install -D hprose
    grpc: true, // npm install -S grpc
  }
}

const { app: electronApp } = require('electron')
const path = require('path')
const winston = require('winston')
const { format } = winston
const { combine } = format

/**
 * 日志类库，基于 winston
 */
module.exports = app => {
  // log 地址，使用系统默认的log地址，在windows 下大概长这样 C:\Users\Administrator\AppData\Roaming\{APPName}\logs\{NODE_ENV}
  const logPath = path.join(electronApp.getPath('logs'), process.env.NODE_ENV || 'development')
  
  // 日志在日志文件的格式
  const fileFormate = combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    // format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  )

  // 日志在控制台格式
  const consoleFormate = combine(
    format.colorize(),
    format.timestamp({
      format: 'HH:mm:ss.SSS'
    }),
    // format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  )

  // 初始化日志
  const logger = winston.createLogger({
    level: 'info',
    format: fileFormate,
    transports: [
      new winston.transports.File({ filename: path.join(logPath, 'error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(logPath, 'combined.log') })
    ]
  })

  // 在开发环境才会启用控制台日志
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: consoleFormate
    }))
  }

  app.log = logger
}

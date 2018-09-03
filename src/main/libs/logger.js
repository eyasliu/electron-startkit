const { app: electronApp } = require('electron')
const path = require('path')
const winston = require('winston')
const { format } = winston
const { combine, timestamp, label, printf } = format;

module.exports = app => {
  // TODO: logpath
  const logPath = path.join(electronApp.getPath('logs'))
  
  const fileFormate = combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    // format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  )

  const consoleFormate = combine(
    format.colorize(),
    format.timestamp({
      format: 'HH:mm:ss.SSS'
    }),
    // format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  )

  const logger = winston.createLogger({
    level: 'info',
    format: fileFormate,
    transports: [
      new winston.transports.File({ filename: path.join(logPath, 'error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(logPath, 'combined.log') })
    ]
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: consoleFormate
    }));
  }

  app.log = logger
}

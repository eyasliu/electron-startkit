console.log(process.env.COMPILER_ENV, process.env.NODE_ENV)
if (process.env.COMPILER_ENV !== 'webpack') {
  require('module-alias/register')
}

require('./libs')

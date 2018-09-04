if (process.env.COMPILER_ENV !== 'webpack') {
  require('module-alias/register')
}

require('./libs')

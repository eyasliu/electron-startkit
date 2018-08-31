module.exports = app => {
  const adapter = {
    ipc: require('./ipc')
  }

  return adapter
}

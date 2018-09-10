
module.exports = ({ Class: { IPC } }) => {
  return new IPC({
    syncChannel: ['sync'],
    asyncChannel: ['async'],
    defaultChannel: 'async'
  })
}

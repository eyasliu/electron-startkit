
module.exports = ({ Class: { IPC }, window }) => {
  return new IPC({
    syncChannel: ['sync'],
    asyncChannel: ['async'],
    defaultChannel: 'async',
    window,
  })
}

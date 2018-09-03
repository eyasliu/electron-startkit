
module.exports = app => entity => {
  if (typeof entity === 'function') {
    return entity(app)
  }
  return entity
}


/**
 * 把 上下文 传入到函数中执行 
 */
module.exports = app => entity => {
  if (typeof entity === 'function') {
    return entity(app)
  }
  return entity
}

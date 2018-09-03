module.exports = {
  send(body = {}, msg, status) {
    this.setDefaultOk()

    this.msg = msg || this.msg
    this.status = status || this.status

    this.body = body || this.body
    this.done()
  },

  ok(body = {}, msg = 'ok', status = 200) {
    this.send(body, msg, status)
  },

  notfound(body = {}, msg = 'route not found.', status = 404) {
    this.send(body, msg, status)
  },

  serverError(body = {}, msg = 'server error.', status = 500) {
    this.send(body, msg, status)
  },
}

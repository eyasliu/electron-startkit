module.exports = {
  send(data) {
    const req = this.req;
    this.setDefaultOK()
    this.data = data
  }
}
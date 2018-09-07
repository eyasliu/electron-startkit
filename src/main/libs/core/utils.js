
module.exports = {
  sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s))
  },
}

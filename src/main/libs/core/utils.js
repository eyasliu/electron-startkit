
module.exports = {
  sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s))
  },
  saveJsonParse(str) {
    if (typeof str !== 'string') {
      return str
    }
    
    let data
    try {
      data = JSON.parse(str)
    } catch (e) {
      data = str
    }
    return data
  },
}

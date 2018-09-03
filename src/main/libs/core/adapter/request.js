const responseMaxTime = 50000 // 如果超过该时间还没有返回，说明请求超时

class Request {
  constructor(data) {
    this.cmd = data.cmd
    this.seqno = data.seqno
    this.body = data.body || data.data
    this.timeout = data.timeout || responseMaxTime
  }
}

module.exports = Request

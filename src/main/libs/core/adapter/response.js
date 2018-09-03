const Emmiter = require('events')
const defaultMsg = 'route is not found.'
const defaultStatus = 404
const defaultBody = {
  error: 'Error: route is not found'
}

const timeoutBody = {
  error: 'Error: gateway timeout 504'
}

class Response extends Emmiter {
  constructor(req) {
    super()
    this.request = req
    this.cmd = req.cmd
    this.seqno = req.seqno

    this.status = defaultStatus
    this.body = defaultBody
    this.msg = defaultMsg
    this.requestMaxTime = req.timeout

    this.done = this._done.bind(this)
  }

  setDefaultOk() {
    if (this.status === defaultStatus) {
      this.status = 200
    }
  
    if (this.msg === defaultMsg) {
      this.msg = 'ok'
    }

    if (this.body === defaultBody) {
      this.body = {}
    }
  }

  _done() {
    this.emit('send')
  }

  _timeout() {
    this.msg = 'timeout'
    this.status = 504
    this.body = timeoutBody
    this.send()
  }

  awaitSend() {
    return new Promise(resolve => {
      const timer = setTimeout(() => {
        this._timeout()
      }, this.requestMaxTime)

      this.on('send', () => {
        resolve()
        clearTimeout(timer)
      })
    })
  }

  toJSON() {
    return {
      msg: this.msg,
      status: this.status,
      cmd: this.cmd,
      seqno: this.seqno,
      body: this.body
    }
  }
}

Response.extends = (mixin) => {
  for (let [key, val] of Object.entries(mixin)) {
    Response.prototype[key] = val
  }
}

module.exports = Response

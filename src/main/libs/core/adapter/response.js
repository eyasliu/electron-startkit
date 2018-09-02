
const defaultMsg = 'route is not found.'
const defaultStatus = 404
const defaultBody = {
  error: new Error('route is not found')
}

class Response {
  constructor() {
    this.isset = false

    this.msg = defaultMsg
    this.status = defaultStatus
    this.body = defaultBody
  }

  setDefaultOk() {
    if (this.status === defaultStatus) {
      this.status = 200
    }
  
    if (this.msg === defaultMsg) {
      this.msg = 'ok'
    }

    if (this.body == defaultBody) {
      this.body = {}
    }
  }

  send(body) {
    this.setDefaultOk()
    this.body = body
  }

  response(mixin) {
    for (let [key, val] of Object.entries(mixin)) {
      Object.getPrototypeOf(this)[key] = val
    }
  }

  get data() {
    return {
      msg: this.msg,
      status: this.status,
      body: this.body
    }
  }

  set body(val) {
    this.setDefaultOk()
    this.body = val
  }
}

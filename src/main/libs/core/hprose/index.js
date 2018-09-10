const hprose = require('hprose')
const noop = () => {}

module.exports = class Hprose {
  constructor(options) {
    // const hprose = require('hprose')

    this.uri = options.uri || options.url
    this.packer = options.packer
    this.parser = options.parser

    if (!this.uri) {
      throw new Error('hprose required url')
    }

    this.instence = hprose.Client.create(this.uri)
    // this.instence.use(this._log)
    this.instence.addFilter({
      inputFilter: this._logData.bind(this),
      outputFilter: this._logData.bind(this),
    })
  }

  _log(name, args, context, next) {
    console.log('before invoke:', name, args)
    var result = next(name, args, context)
    result.then(function(result) {
      console.log('after invoke:', name, args, result)
    }).catch(err => {
      console.log('error invoke:', err, name, args, result)
    })

    return result
  }

  _logData(data, context) {
    console.log(hprose.BytesIO.toString(data))
    const buffer = this.packer(context.userdata)
    // debugger
    return new hprose.BytesIO(buffer)
    // return data
  }

  useRequest() {}
  useResponse() {}

  init() {}

  route() {}

  on() {}

  send(cmd, data, ...args) {
    let option = null
    if (typeof cmd === 'string') {
      // compatible send('login', {...data})
      option = {
        cmd,
        data: data || {}
      }
    } else if (cmd && typeof cmd === 'object') {
      // compatible send({
      //   cmd: 'login',
      //   data: { ...data }
      // })
      option = {
        ...cmd
      }
      args.unshift(data)
    } else {
      throw new Error('send argument error.')
    }

    return this._sendHandler(...[option, ...args])
  }

  _sendHandler(options, ...args) {
    this.instence.invoke('placeholder', [], noop, { userdata: options })
      .then(res => {
        console.log(res)
        return res
      })
      .catch(err => {
        console.log(err)
        return err
      })
  }
}

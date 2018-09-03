/**
 * 路由处理，主要处理 IPC，或者其他后端服务发送来的消息转发
 */

const Request = require('./request')
const Response = require('./response')

class Router {
  constructor(option) {
    this.routes = option.routes || {}
    this.adapter = option.adapter
    this.parser = option.parser || this.defaultParser

    this.onData = this.onDataHandler.bind(this)
  }
  defaultParser(data) {
    return data.cmd
  }

  set(option) {
    this.routes = option.routes || {}
    this.parser = option.parser || this.defaultParser
  }

  async onDataHandler(data) {
    const route = this.parser(data)
    const handler = this.routes[route]

    const request = new Request(data)
    const response = new Response(request)

    if (typeof handler === 'function') {
      handler(request, response)
      await response.awaitSend()
    } else {
      response.send(handler)
    }

    const responseData = response.toJSON()

    return responseData
  }

  /**
   * 解析收到的请求
   * @param {object} body 请求数据
   */
  receive(adapter, body) {
    const routeId = adapter.adapterID
    const parser = this.parsers.get(routeId)
    const route = parser(body)

    const res = this.onData(routeId, route, body)
    return res
  }
}

module.exports = Router

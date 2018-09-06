/**
 * 路由处理，主要处理其他后端服务或其他进程发送来的消息，转发到具体的处理函数
 */

const Request = require('./request')
const Response = require('./response')

// 404 处理函数
const notFoundHandler = (req, res) => {
  res.send({}, 'not found', 404)
}

class Router {
  constructor(option) {
    this.routes = option.routes || {} // 路由表映射
    this.adapter = option.adapter // 适配器
    this.parser = option.parser || this.defaultParser // 路由名称解析器

    this.onData = this.onDataHandler.bind(this) // 给适配器用的通知有数据过来，并处理
  }

  // 默认的解析器只会返回 cmd 字段
  defaultParser(data) {
    return data.cmd
  }

  /**
   * 增加路由表、替换路由名称解析器
   * @param {object} option.routes 路由表
   * @param {Function} option.parser 路由名称解析器
   */
  set(option) {
    Object.assign(this.routes, option.routes || {})
    this.parser = option.parser || this.defaultParser
  }

  /**
   * 数据处理过程
   * @param {object} data 收到的数据
   * 
   * @return {Promise} object 请求数据处理完成后的回应数据
   */
  async onDataHandler(data) {
    const route = this.parser(data)
    const handler = this.routes[route]

    const request = new Request(data)
    const response = new Response(request)

    
    if (typeof handler === 'undefined') {
      // 404 not found
      notFoundHandler(request, response)
    }else if (typeof handler === 'function') {
      // 交给具体的处理函数，并等待返回
      handler(request, response)
      await response.awaitSend()
    } else {
      // just route value
      response.send(handler)
    }

    const responseData = response.toJSON()

    return responseData
  }
}

module.exports = Router

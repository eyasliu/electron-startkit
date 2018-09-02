/**
 * 路由处理，主要处理 IPC，或者其他后端服务发送来的消息转发
 */
class Router {
  constructor() {
    this.routes = new Map()
    this.parsers = new Map()
    this.register = this.registerRoute.bind(this)
    // TODO: response
    this.response = {
      ok() {},
      send() {},
    }
  }

  registerRoute(adapter, parser, routes) {
    if (!adapter || !adapter.routerHandler) {
      throw new Error('Invalid adapter, require routerHandler() method')
    }

    const adapterID = adapter.adapterID

    // 记录路由
    this.routes.set(adapterID, routes)
    this.parsers.set(adapterID, parser)

    adapter.registerRouterHandler(data => {
      const res = this.receive(adapter, data)

      return res
    })
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

  /**
   * 触发路由
   * @param {number} id Adapter id
   * @param {string} route 路由名称
   * @param {any} data 路由请求的数据
   */
  onData(id, route, data) {
    // if (!this.isReady) {
    //   this.beforeReadyCache.push({
    //     id, route, data
    //   })
    //   return
    // } else if (this.beforeReadyCache.length) {

    //   const cache = this.beforeReadyCache
    //   this.beforeReadyCache = []
    //   cache.forEach(config => {
    //     this.onData(config.id, config.route, config.data)
    //   })
    //   // for (let config of this.beforeReadyCache) {
    //   // }
    //   // this.beforeReadyCache.clear()
    // }
    const routes = this.routes.get(id)
    if (routes.hasOwnProperty(route)) {
      const handler = routes[route]
      if (typeof handler === 'function') {
        return handler(data, this.response)
      } else {
        return handler
        // throw new Error(`route ${route} handler is invalid!`)
      }
    } else {
      return null
    }
  }
}

module.exports = Router

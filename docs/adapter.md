# 适配器

在与其他服务端、客户端、其他进程进行数据交换时，都由 adapter 处理

## 类型

已准备了如下几个适配器

* [Adapter](#adapter)
* [ClientAdapter](#clientadapter)
* [ServerAdapter](#serveradapter)
* [TCPAdapter](#tcpadapter)
* [HTTPAdapter](#httpadapter)


#### Adapter
[](name=adapter)

上下文 `app.Class.Adapter`

适配器基类，所有的适配器都继承与该类，该类用于定义适配器对外的统一 API，其他适配器类继承该类后扩展其自身独有功能

##### API

* constructor() 构造函数
  + @return 适配器实例

* onData(data)
```
  /**
   * 数据在适配器层流动处理，会自动应用路由和中间件
   * @param {object} data 请求进来的数据
   */
```

* useRequest(fn)
```
  /**
   * 增加请求中间件
   * 
   * @param {Function} fn 中间件函数
   */
```

* useResponse(fn)

```
  /**
   * 增加回应的中间件
   * @param {Function} fn 中间件函数
   */
```

* routes(routes, parser)

```
  /**
   * 给路由增加映射处理函数
   * @param {object} routes key 是 路由名称，由 paser 返回的数据，value 是处理函数
   * @param {Function} parser 解析数据得到路由名称
   */
```

* async send(cmd, data, ...args)

```
  /**
   * 从适配器发送数据，兼容两种用法，这里只作为封装用途，使得所有适配的调用方法一致
   * 
   * @example
   * send('login', {...data})
   *
   * @example 
   * send({
   *   cmd: 'login',
   *   data: { ...data }
   * })
   * 
   * @param {object|string} cmd 路由名称，或者路由数据对象
   * @param {object} data 路由数据对象
   * @param  {...any} args 扩展参数，为子类备用
   */
```

* extends(helpers)

```
  /**
   * 扩展功能，为adapter添加扩展工具函数
   * @param {object} helpers 函数map对象
   */
```

##### implement 需要子类实现的接口

* sendHandler(body)

发送数据的具体逻辑，body 是需要发送的数据

```
  /**
   * 真正处理发送的函数，由子类实现
   * @param {object} body 数据对象
   */
```

* msgPackParser(buffer)

收到数据包之后怎么解析为真实数据，这里需要处理 tcp 的粘包、半包等等，因为一个包可能会带有多条数据，所以需要返回一个数组

```
  /**
   * 解析收到的数据包，由子类实现
   * @param {Buffer} buffer 收到的数据包
   * 
   * @return {Array} 解析好的数据数组
   */
```


#### ClientAdapter
[](name=clientadapter)

上下文 `app.Class.ClientAdapter`

作为客户端连接其他的服务器

##### API

* contructor(options)
  + @param {String} options.host 服务器地址
  + @param {String} options.port 服务器端口

* 无

##### implement 需要子类实现的接口

* auth()

服务验证，使用 this.send(...) 发送一些验证的行为，并把验证结果通过 Promise 返回 boolean 值

_默认行为：直接返回 true，即**不验证**_

```
  /**
   * 客户端验证，由子类实现，默认行为是不验证
   * 
   * @return {Promise|boolean} 验证结果 bool 值
   */
```

* heartbeat()

```
  /**
   * 如何发送心跳，由子类实现，默认行为是不发送
   */
```



#### ServerAdapter
[](name=serveradapter)

上下文 `app.Class.ServerAdapter`

启动一个 TCP 服务器，让其他服务连接过来

##### API

* contructor(options)
  + @param {String} options.host 本地IP地址，默认 127.0.0.1
  + @param {String} options.port 服务器端口

```

```

#### HTTPAdapter
[](name=httpadapter)


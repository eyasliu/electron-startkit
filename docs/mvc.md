# 路由

路由功能是基于 adapter 的 routes 方法注册路由转发

```js
module.exports = ({adapter: { ipc }, controller: { user }}) => {
  // key 是由注册路由第二个参数解析的结果，val是指定的控制器
  ipc.routes(
    {
      'checkLogin': user.Check
    },
    data => data.cmd
  )
}
```

# 控制器

控制器实现对应命令的业务逻辑，类似于 express 的 api 风格处理 ipc、tcp 等请求

```js
module.exports = ({store: { userStore }}) => ({
  Check(req, res) {
    const { cmd, body } = req

    const isLogin = userStore.check()

    // res有send，ok，serverError，notfound 方法
    res.ok({
      list: []
    })

    // res.serverError({error: 'some error'})
  }
})
```

# 状态数据

```js
module.exports = app => ({
  // 数据集
  data: {
    current: {},
    isLogin: false
  },
  // 计算属性数据
  computed: {
    info() {
      return this.current
    }
  },
  // 处理数据的通用方法
  methods: {
    check() {
      return this.isLogin ? false : this.info
    }
  },
})
```
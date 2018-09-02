module.exports = app => app.Controller({
  mixin: require('./method'),
  data: {
    demo: true
  },
  init(app) {
    console.log(service, controller, app, this)
  },
  async reboot (req, res) {
    const data = req.data

    const done = data

    res.msg = 'OK'
    res.ok({
      time: new Date(),
      ...done
    })
  },
  healthcheck(req, res) {
    res.send({
      test: 'anythink is ok'
    })
  }
})

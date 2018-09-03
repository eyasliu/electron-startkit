module.exports = (app) => ({
  data: {
    demo: true
  },
  init(app) {
    console.log(app, this)
  },
  async reboot (req, res) {
    // App
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
  },
})

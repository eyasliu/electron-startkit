module.exports = (app) => ({
  data: {
    demo: true
  },
  init(app) {
    console.log(app, this)
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
    setTimeout(() => {
      // res.notfound(null, 'haha', 303)
    }, 1000)
  },
})

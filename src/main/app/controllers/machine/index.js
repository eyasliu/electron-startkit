module.exports = ({ store: { user } }) => ({
  data: {
    demo: true
  },
  init(app) {
    // console.log(app, this)
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
    user.login({ id: 1234 })
    res.ok(user, 'haha', 303)
  },
})

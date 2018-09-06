module.exports = ({ store: { user }, db }) => ({
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
    db.get('SELECT 1 + 1;', (err, dbRes) => {
      if (err) {
        return
      }
      res.ok({
        user,
        db: dbRes
      }, 'haha', 303)
    })
  },
})

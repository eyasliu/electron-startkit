module.exports = ({ 
  store: { user },
  adapter: { ipc },
  db,
}) => ({
  data: {
    demo: true
  },
  init(app) {
    // console.log(app, this)
  },
  login(req, res) {
    user.login({ id: 1234 })
    const resdata = res.toJSON()

    ipc.send({
      ...resdata,
      test: 'hahahahahahahahahahhaha'
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

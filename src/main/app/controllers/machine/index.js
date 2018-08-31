export default app => ({
  init() {},
  mixin: import('./method'),

  reboot(req, res) {
    const data = req.data

    const done = data
      |> await this.check
      |> await this.shutdown
      |> await this.boot

    res.msg = "OK"
    res.ok({
      time: new Date(),
      ...done
    })
  }
})

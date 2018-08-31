
module.exports = context => (fn, name) => {
  const placeholder = {
    init() {
      delete this.init
      const config = fn(context)
      if (!config) {
        return
      }
      for (let [key, val] of Object.entries(config)) {
        if (key === 'data') {
          this.instence[key] = val || {}
        } else if (typeof val === 'function') {
          this.instence[key] = val.bind(this.instence)
        } else {
          this.instence[key] = val
        }
      }
      if (this.instence.init) {
        this.instence.init(this.$context)
      }
    }
  }
  return placeholder
}

class Preloader {
  constructor(instence) {
    this.instence = instence
    this.setInit()
  }

  setInit() {
    this.instence.init = this.initialize.bind(this)
  }

  setProto(key, val) {
    Object.getPrototypeOf(this)[key] = val
  }

  initialize() {}
}

module.exports.Preloader = Preloader

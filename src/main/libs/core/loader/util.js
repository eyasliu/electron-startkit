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

// function Preloader (instence) {
//   this.instence = instence
//   this.setInit()
// }

// Preloader.prototype.setInit = function() {
//   this.instence.init = this.initialize.bind(this)
// }

// Preloader.prototype.setProto = function(key, val) {
//   Object.getPrototypeOf(this)[key] = val
// }

// Preloader.prototype.initialize = function() {}

// module.exports.Preloader = Preloader

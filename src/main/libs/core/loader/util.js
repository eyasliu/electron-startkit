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

/**
 * 这里有点玄幻，如果用了 webpack 加上 babel-loader，下面这段话就会报错 webpack/webpack#4039 ，我不知道什么原因，
 * 如果你知道，请提个 issue 告诉我
 * 如果你的没有报错，恭喜你，可以放心大胆使用 webpack + babel-loader，并且不用特地跟我说
 */
module.exports.Preloader = Preloader

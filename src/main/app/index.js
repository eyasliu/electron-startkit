import Lib from '@/libs'

export default class App extends Lib.APP {
  constructor(config) {
    super()
    this.config = config
    this.init()
  }

  init() {
    if (this.config.updater) {
      this.load('updater', import('./services/updater'))
    }
  }
  
}

export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'test'
  }

  destroy () {
    super.destroy()
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._test = true
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._test
    }
  }

  test () {
    console.log('test')
  }

}

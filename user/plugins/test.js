
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'test'
  }

  destroy () {
    super.destroy()
  }

  load (obj, options = {}) {
    obj._test = true
    super.load(obj, options)
  }

  unload (obj) {
    delete obj._test
    super.unload(obj)
  }

  test () {
    console.log('test')
  }

}

export default class TestPlugin extends app.Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'test'
  }

  destroy () {
  }

  load (obj, options = {}) {
    super.load(obj, options)
  }

  unload (obj, options = {}) {
    super.unload(obj, options)
  }


}

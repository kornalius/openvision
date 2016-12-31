
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'disabled'
    this._desc = 'Allow container to be disabled.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/31/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj.disabled = false
  }

  unload (obj) {
    delete obj._disabled
    super.unload(obj)
  }

  get disabled () { return this._disabled }

  set disabled (value) {
    this._disabled = value
    this.update()
  }

}

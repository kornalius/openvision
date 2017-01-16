
export default class Disabled extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'disabled'
    this._desc = 'Allow container to be disabled.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/07/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj.disabled = true
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._disabled
    }
  }

  get disabled () { return this._disabled }
  set disabled (value) {
    this._disabled = value
    this.update()
  }

}


export default class Readonly extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'readonly'
    this._desc = 'Allow container to be in a readonly state.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/16/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj.readonly = true
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._readonly
    }
  }

  get readonly () { return this._readonly }
  set readonly (value) {
    this._readonly = value
    this.update()
  }

}


export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'readonly'
    this._desc = 'Allow container to be in a readonly state.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/31/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj.readonly = true
  }

  unload (obj) {
    delete obj._readonly
    super.unload(obj)
  }

  get readonly () { return this._readonly }

  set readonly (value) {
    this._readonly = value
    this.update()
  }

}

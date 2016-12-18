
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'editable'
    this._desc = 'Allow container to be editable.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/16/2016'
    this._deps = ['focusable']
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj._readonly = false
  }

  unload (obj) {
    delete obj._readonly
    super.unload(obj)
  }

  get readonly () { return this._readonly }

  set readonly (value) { this._readonly = value }

}

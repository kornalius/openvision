
export default class Editable extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'editable'
    this._desc = 'Allow container to be editable.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/16/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
    }
  }

}

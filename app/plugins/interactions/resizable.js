
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'resizable'
    this._desc = 'Allow container to be resized with the mouse.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/04/2016'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
  }

}

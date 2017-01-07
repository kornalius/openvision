
export default class Resizable extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'resizable'
    this._desc = 'Allow container to be resized with the mouse.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.1'
    this._date = '01/07/2017'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options) {
    if (super.load(obj, options)) {
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
    }
  }

}

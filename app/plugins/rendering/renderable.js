
export default class Renderable extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'renderable'
    this._desc = 'Allow to customize the drawing of a container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/07/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
    }
  }

  draw () {

  }

}

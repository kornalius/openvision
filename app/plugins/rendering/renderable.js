
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'renderable'
    this._desc = 'Allow to customize the drawing of a container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.1'
    this._date = '12/31/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
  }

  draw () {

  }

}

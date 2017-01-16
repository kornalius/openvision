
export default class Bar extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'bar'
    this._desc = 'Container that has sections.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/16/2017'
    this._deps = ['control', 'layout']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._bar = {
      }
      obj.layout()
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._bar
    }
  }

  addBarSection (container) {
    this.addChild(container)
    this.update()
  }

  removeBarSection (container) {
    this.removeChild(container)
    this.update()
  }

}

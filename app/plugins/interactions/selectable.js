
export default class Selectable extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'selectable'
    this._desc = 'Allow container to be selected.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/07/2017'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options) {
    if (super.load(obj, options)) {
      obj._selected = false
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._selected
    }
  }

  get canSelect () { return !_.isNil(this._parentSelector) }

  get selected () { return this._selected }

  set selected (value) {
    if (value !== this._selected) {
      this._selected = value
      this.emit(value ? 'select' : 'unselect')
    }
  }

  toggle () {
    this.selected = !this.selected
  }

}

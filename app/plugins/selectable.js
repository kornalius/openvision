import { Plugin } from '../plugin.js'

export class Selectable extends Plugin {

  get name () { return 'selectable' }
  get desc () { return 'Allow container to be moved around with the mouse.' }
  get author () { return 'Alain Deschenes' }
  get version () { return '1.0.0' }
  get date () { return '12/04/2016' }

  load (obj, options) {
    super.load(obj, options)
    this._selected = false
    this._parentSelector = null
  }

  unload (obj) {
    super.unload(obj)
    delete this._selected
  }

  get parentSelector () { return this._parentSelector }

  set parentSelector (value) {
    if (value !== this._parentSelector) {
      this._parentSelector = value
    }
  }

  get canSelect () { return !this._parentSelector || this._parentSelector.canSelect(this) }

  get selected () { return this._selected }

  set selected (value) {
    if (value !== this._selected) {
      this._selected = value
      this.parent.emit('select', this)
    }
  }

}

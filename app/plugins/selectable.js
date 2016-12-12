
export class SelectableClass extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'selectable'
    this._desc = 'Allow container to be selected.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/04/2016'
  }

  load (obj, options) {
    super.load(obj, options)
    obj._selected = false
  }

  unload (obj) {
    delete obj._selected
    super.unload(obj)
  }

}


export let SelectableMixin = Mixin(superclass => class SelectableMixin extends superclass {

  get canSelect () { return !_.isNil(this._parentSelector) }

  get selected () { return this._selected }

  set selected (value) {
    if (value !== this._selected) {
      this._selected = value
      this.emit(value ? 'select' : 'unselect', this)
    }
  }

  toggle () {
    this.selected = !this.selected
  }

})

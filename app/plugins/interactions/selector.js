
export default class Selector extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'selector'
    this._desc = 'Allow child containers to be selectable.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/07/2017'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options) {
    if (super.load(obj, options)) {
      obj._selectables = []
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._selectables
    }
  }

  get selectables () { return this._selectables }

  addSelectable (obj) {
    if (!_.includes(this._selectables, obj)) {
      this._selectables.push(obj)
      obj._parentSelector = this
    }
    return this
  }

  removeSelectable (obj) {
    _.pull(this._selectables, obj)
    delete obj._parentSelector
    return this
  }

  canSelect (obj) {
    return _.includes(this._selectables, obj) && obj.canSelect
  }

  isSelected (obj) {
    return this.canSelect(obj) && obj.selected
  }

  select (obj) {
    if (this.canSelect(obj)) {
      obj.select()
    }
    return this
  }

  unselect (obj) {
    if (this.canSelect(obj)) {
      obj.unselect()
    }
    return this
  }

  toggle (obj) {
    if (this.canSelect(obj)) {
      if (this.isSelected(obj)) {
        obj.unselect()
      }
      else {
        obj.select()
      }
    }
    return this
  }

  setSelected (obj, value) {
    if (this.canSelect(obj)) {
      obj.selected = value
    }
    return this
  }

}

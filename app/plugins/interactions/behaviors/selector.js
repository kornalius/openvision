
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'selector'
    this._desc = 'Allow child containers to be selectable.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/04/2016'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options) {
    super.load(obj, options)
    obj._selectables = []
  }

  unload (obj) {
    delete obj._selectables
    super.unload(obj)
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

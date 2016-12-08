import { Plugin } from '../plugin.js'
import { StatesMixin } from '../states.js'


export class Selector extends mix(Plugin).with(StatesMixin) {

  get name () { return 'selector' }
  get desc () { return 'Allow child containers to be selectable.' }
  get author () { return 'Alain Deschenes' }
  get version () { return '1.0.0' }
  get date () { return '12/07/2016' }

  load (obj, options) {
    super.load(obj, options)
    this._selectables = []
  }

  unload (obj) {
    super.unload(obj)
    delete this._selectables
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

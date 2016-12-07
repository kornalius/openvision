import { Plugin } from '../plugin.js'
import { StatesMixin } from '../states.js'
import { mix } from 'mixwith'


export class Selectable extends mix(Plugin).with(StatesMixin) {

  get name () { return 'selectable' }
  get desc () { return 'Allow container to be selected.' }
  get author () { return 'Alain Deschenes' }
  get version () { return '1.0.0' }
  get date () { return '12/04/2016' }

  load (obj, options) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
    this.removeState('selected')
  }

  get canSelect () { return !_.isNil(this._parentSelector) }

  get selected () { return this.hasState('selected') }

  set selected (value) {
    if (value !== this._selected) {
      this.setState('selected', value)
      this.emit(value ? 'select' : 'unselect', this)
    }
  }

  toggle () {
    this.selected = !this.selected
  }

}

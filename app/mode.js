import { OpenObject } from './openobject.js'

export var modes = {}

export class Mode extends OpenObject {

  constructor () {
    super()
    modes[this.name] = this
  }

  destroy () {
    modes[this.name] = undefined
    super.destroy()
  }

  get name () { return '' }

  get desc () { return '' }

  get author () { return '' }

  get version () { return '' }

  get date () { return '' }

  get changelog () { return '' }

  load (term, options) {
  }

  unload (term) {
  }

}

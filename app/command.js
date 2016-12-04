import { Base } from './objects/base.js'

export var commands = {}

export class Command extends Base {

  constructor () {
    super(...arguments)
    commands[this.name] = this
  }

  destroy () {
    super()
    commands[this.name] = undefined
  }

  get name () { return '' }

  get private () { return false }

  get tags () { return ['command', this.name] }

  get desc () { return '' }

  get author () { return '' }

  get version () { return '1.0.0' }

  get date () { return '' }

  exec (options = {}) {
  }

}

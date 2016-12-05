import { mixin } from './globals.js'
import { Base } from './objects/base.js'
import { Meta } from './meta.js'


export var commands = {}


export class Command extends Base {

  constructor () {
    super()
    commands[this.name] = this
  }

  destroy () {
    super.destroy()
    commands[this.name] = undefined
  }

  get tags () { return _.concat([super.tags, 'command']) }

  exec (options = {}) {
  }

}

mixin(Command.prototype, Meta.prototype)

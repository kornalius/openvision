import { mixin } from './globals.js'
import { Base } from './objects/base.js'
import { Meta, extractMetaFromOptions } from './meta.js'


export var commands = {}

export var Command = class {}

if (Base) {
  Command = class extends Base {

    constructor (options = {}) {
      super()
      extractMetaFromOptions(this, options)
      commands[this.name] = this
    }

    destroy () {
      commands[this.name] = undefined
      super.destroy()
    }

    get tags () { return _.concat(this._tags, 'command') }

    exec (options = {}) {
    }

  }

  mixin(Command.prototype, Meta.prototype)
}

export class CommandMixin {

  command (name, options = {}) {
    if (_.isObject(name)) {
      options = name
      name = _.get(options, 'name')
    }
    return new Command(_.extend(options, { name }))
  }

}

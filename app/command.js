import { Base } from './objects/base.js'
import { MetaMixin, extractMetaFromOptions } from './meta.js'
import { mix, Mixin } from 'mixwith'


export var commands = {}

export var Command = class {}

if (Base) {
  Command = class extends mix(Base).with(MetaMixin) {

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
}


export let CommandMixin = Mixin(superclass => class extends superclass {

  command (name, options = {}) {
    if (_.isObject(name)) {
      options = name
      name = _.get(options, 'name')
    }
    return new Command(_.extend(options, { name }))
  }

})

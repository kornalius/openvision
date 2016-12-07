import { Base } from './objects/base.js'
import { commands } from './command.js'
import { keyboard } from 'keyboardjs'
import { Mixin } from 'mixwith'


export var shortcuts = {}


export { keyboard }


export var Shortcut = class {}


if (Base) {
  Shortcut = class extends Base {

    constructor (options = {}) {
      super()
      this._shortcut = _.get(options, 'shortcut', '')
      this._commands = _.get(options, 'commands', [])
      shortcuts[this.shortcut] = this
      keyboard.bind(this.shortcut, this.exec.bind(this))
    }

    destroy () {
      shortcuts[this.shortcut] = undefined
      keyboard.unbind(this.shortcut)
      super.destroy()
    }

    get tags () {
      let tags = ['shortcut']
      for (let cmd of this._commands) {
        let c = commands[cmd.command]
        if (c) {
          tags = _.concat(tags, c.tags)
        }
      }
      return tags
    }

    get shortcut () { return this._shortcut }

    get commands () { return this._commands }

    exec () {
      for (let cmd of this._commands) {
        let c = commands[cmd.command]
        if (c) {
          c.exec(cmd.options)
        }
      }
    }

  }
}


export let ShortcutMixin = Mixin(superclass => class extends superclass {

  shortcut (shortcut, options = {}) {
    if (_.isObject(shortcut)) {
      options = shortcut
      shortcut = _.get(options, 'shortcut')
    }
    return new Shortcut(_.extend(options, { shortcut }))
  }

})

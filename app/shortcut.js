import { Base } from './objects/base.js'
import { commands } from './command.js'

export var shortcuts = {}

export class Shortcut extends Base {

  constructor () {
    super(...arguments)
    shortcuts[this.shortcut] = this
  }

  destroy () {
    super()
    shortcuts[this.shortcut] = undefined
  }

  get shortcut () { return '' }

  get commands () { return [] }

  exec () {
    for (let cmd of this.commands) {
      let c = commands[cmd.name]
      if (c) {
        c.exec(cmd.options)
      }
    }
  }

}

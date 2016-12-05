import { Base } from './objects/base.js'
import { commands } from './command.js'
import Combokeys from 'combokeys'


export var shortcuts = {}

var combokeys = new Combokeys(document.documentElement)


export class Shortcut extends Base {

  constructor (shortcut, commands) {
    super()
    this._shortcut = shortcut
    this._commands = commands
    shortcuts[this.shortcut] = this
    combokeys.bind(this.shortcut, this.exec.bind(this))
  }

  destroy () {
    super.destroy()
    shortcuts[this.shortcut] = undefined
    combokeys.unbind(this.shortcut)
  }

  get shortcut () { return this._shortcut }

  get commands () { return this._commands }

  exec () {
    for (let cmd of this.commands) {
      let c = commands[cmd.name]
      if (c) {
        c.exec(cmd.options)
      }
    }
  }

}

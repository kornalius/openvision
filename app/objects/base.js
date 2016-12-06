import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { mixin } from '../globals.js'

class Base extends PIXI.utils.EventEmitter {

  tick (delta) {
    // this.emit('tick', { delta })
    return this
  }

  async (fn, args, delay) {
    if (_.isNumber(args)) {
      delay = args
      args = []
    }
    if (!_.isArray(args)) {
      args = [args]
    }
    setTimeout(() => {
      fn.call(this, ...args)
    }, delay || 1)
  }

  __detail (d) {
    return _.extend({ time: performance.now(), defaultPrevented: false }, d || {})
  }

  emit (name, detail) {
    let d = this.__detail(detail)
    // super.emit(name, d)
    return d
  }

}

mixin(Base.prototype, PluginMixin.prototype, ModeMixin.prototype, CommandMixin.prototype, ShortcutMixin.prototype)

export { Base }

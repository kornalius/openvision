import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'


export let BaseMixin = Mixin(superclass => class BaseMixin extends superclass {

  tick (delta) {
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

})


export class Base extends mix(PIXI.utils.EventEmitter).with(BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin) {}

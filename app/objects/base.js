import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { DBMixin } from './db.js'
import { Encoder } from '../lib/encoder.js'
import { EmitterMixin } from '../event.js'


export let BaseMixin = Mixin(superclass => class BaseMixin extends superclass {

  encode () {
    return Encoder.encode(this)
  }

  static decode (doc) {
    return Encoder.decode(doc)
  }

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

class EmptyClass {}

export class Base extends mix(EmptyClass).with(EmitterMixin, BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin) {}


Encoder.register('Base', {
  encode: obj => { return {} },
  decode: (doc, obj) => obj || new Base(),
})

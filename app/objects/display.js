import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { updates } from '../updates.js'


export let DisplayMixin = Mixin(superclass => class extends superclass {

  destroy () {
    if (updates) {
      updates.remove(this)
    }
    this.emit('destroy')
    super.destroy()
  }

  update (options = {}) {
    updates.add(this, options)
    this.emit('update')
    this.updateTransform()
  }

})


export class Display extends mix(PIXI.DisplayObject).with(BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin, DisplayMixin) {}

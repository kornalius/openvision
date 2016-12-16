import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { ModeMixin } from '../mode.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { updates } from '../updates.js'


export let DisplayMixin = Mixin(superclass => class DisplayMixin extends superclass {

  destroy () {
    if (updates) {
      updates.remove(this)
    }
    super.destroy()
  }

  update (options = {}) {
    updates.add(this, _.extend(options, {
      cb: () => {
        if (_.isFunction(this.render)) {
          this.render()
        }
        this.updateTransform()
      }
    }))
  }

})


export class Display extends mix(PIXI.DisplayObject).with(BaseMixin, PluginMixin, ModeMixin, CommandMixin, ShortcutMixin, DisplayMixin) {}

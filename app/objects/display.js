import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { updates } from '../updates.js'
import { DBMixin } from './db.js'


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
        if (this.parent) {
          this.updateTransform()
        }
      }
    }))
  }

})


export class Display extends mix(PIXI.DisplayObject).with(BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin) {}

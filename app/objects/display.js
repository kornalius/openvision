import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { updates } from '../updates.js'
import { DBMixin } from './db.js'
import { Encoder } from './encoder.js'


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


Encoder.register('Display', {
  inherit: 'Base',

  encode: obj => {
    let doc = {
      x: obj.x,
      y: obj.y,
      scale: obj.scale,
      pivot: obj.pivot,
      skew: obj.skew,
      rotation: obj.rotation,
      alpha: obj.alpha,
      visible: obj.visible,
      renderable: obj.renderable,
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Display()
    obj.x = doc.x
    obj.y = doc.y
    obj.scale = doc.scale
    obj.pivot = doc.pivot
    obj.skew = doc.skew
    obj.rotation = doc.rotation
    obj.alpha = doc.alpha
    obj.visible = doc.visible
    obj.renderable = doc.renderable
    return obj
  },
})

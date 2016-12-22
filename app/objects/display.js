import { BaseMixin } from './base.js'
import { PluginMixin } from '../plugin.js'
import { CommandMixin } from '../command.js'
import { ShortcutMixin } from '../shortcut.js'
import { updates } from '../updates.js'
import { DBMixin } from './db.js'
import { serialize_point, deserialize_point } from '../utils.js'


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

  deserialize (doc) {
    this.x = doc.x
    this.y = doc.y
    this.scale = deserialize_point(doc.scale)
    this.pivot = deserialize_point(doc.pivot)
    this.skew = deserialize_point(doc.skew)
    this.rotation = doc.rotation
    this.alpha = doc.alpha
    this.visible = doc.visible
    this.renderable = doc.renderable
  }

  serialize () {
    return _.extend({}, super.serialize(), {
      x: this.x,
      y: this.y,
      scale: serialize_point(this.scale),
      pivot: serialize_point(this.pivot),
      skew: serialize_point(this.skew),
      rotation: this.rotation,
      alpha: this.alpha,
      visible: this.visible,
      renderable: this.renderable,
    })
  }

})


export class Display extends mix(PIXI.DisplayObject).with(BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin) {}

import { BaseMixin } from '../base.js'
import { EmitterMixin } from '../../event.js'
import { PluginMixin } from '../../plugin.js'
import { CommandMixin } from '../../command.js'
import { ShortcutMixin } from '../../shortcut.js'
import { updates } from '../../lib/updates.js'
import { DBMixin } from '../db.js'
import { Encoder, e, d } from '../../lib/encoder.js'


export let DisplayMixin = Mixin(superclass => class DisplayMixin extends superclass {

  destroy () {
    if (updates) {
      updates.remove(this)
    }
    super.destroy()
  }

  get left () { return this.x }
  set left (value) {
    this.x = value
    this.update()
  }

  get top () { return this.y }
  set top (value) {
    this.y = value
    this.update()
  }

  get right () { return this.x + this.width }
  set right (value) {
    this.width = value - this.x
    this.update()
  }

  get bottom () { return this.y + this.height }
  set bottom (value) {
    this.height = value - this.y
    this.update()
  }

  update (options = {}) {
    updates.add(this, _.extend(options, {
      cb: () => {
        if (_.get(this, '__plugins.renderable')) {
          this.draw()
        }
        if (this.parent) {
          this.updateTransform()
        }
      }
    }))
    return this
  }

  moveTo (x, y) {
    this.position.set(x, y)
    return this.update()
  }

  moveBy (bx, by) {
    return this.moveTo(this.x + bx, this.y + by)
  }

  resize (width, height) {
    this.width = width
    this.height = height
    return this.update()
  }

})


export class Display extends mix(PIXI.DisplayObject).with(EmitterMixin, BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin) {}


Encoder.register('Display', {
  inherit: 'Base',

  encode: obj => {
    let doc = {}
    doc.position = e('position', obj, doc)
    doc.scale = e('scale', obj, doc)
    doc.pivot = e('pivot', obj, doc)
    doc.skew = e('skew', obj, doc)
    doc.rotation = e('rotation', obj, doc)
    doc.alpha = e('alpha', obj, doc)
    doc.visible = e('visible', obj, doc)
    doc.renderable = e('renderable', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    if (!obj) {
      obj = new Display()
    }
    obj.position = d('position', doc, obj)
    obj.scale = d('scale', doc, obj)
    obj.pivot = d('pivot', doc, obj)
    obj.skew = d('skew', doc, obj)
    obj.rotation = d('rotation', doc, obj)
    obj.alpha = d('alpha', doc, obj)
    obj.visible = d('visible', doc, obj)
    obj.renderable = d('renderable', doc, obj)
    return obj
  },
})

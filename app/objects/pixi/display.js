import { BaseMixin } from '../base.js'
import { EmitterMixin } from '../../event.js'
import { PluginMixin } from '../../plugin.js'
import { CommandMixin } from '../../command.js'
import { ShortcutMixin } from '../../shortcut.js'
import { updates } from '../../lib/updates.js'
import { DBMixin } from '../db.js'
import { Encoder, e, d } from '../../lib/encoder.js'

export let DisplayMixin = Mixin(superclass => class DisplayMixin extends superclass {

  constructor () {
    super(...arguments)
    this._trackUpdateEvents = false
  }

  destroy () {
    if (updates) {
      updates.remove(this)
    }
    super.destroy()
  }

  get trackUpdateEvents () { return this._trackUpdateEvents }
  set trackUpdateEvents (value) { this._trackUpdateEvents = value }

  get left () { return this.x }
  set left (value) { this.x = value }

  get top () { return this.y }
  set top (value) { this.y = value }

  get topLeft () { return { x: this.x, y: this.y } }
  set topLeft (value) {
    this.x = value.x
    this.y = value.y
  }

  moveTo (x, y) {
    this.x = x
    this.y = y
    return this
  }

  moveBy (bx, by) {
    return this.moveTo(this.x + bx, this.y + by)
  }

  floor () {
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    return this
  }

  ceil () {
    this.x = Math.ceil(this.x)
    this.y = Math.ceil(this.y)
    return this
  }

  update (options = {}) {
    updates.add(this, _.extend(options, {
      cb: () => {
        // if (this.__renderable) {
          // this.draw()
        // }
        // if (this.parent) {
          // this.updateTransform()
        // }
      }
    }))
    this.emit('update', options)
    return this
  }

  updateTransform () {
    let o = this._oldTransform
    if (this._trackUpdateEvents) {
      if (o) {
        if (this.x !== o.x || this.y !== o.y) {
          this.emit('move', { x: o.x, y: o.y })
        }
        if (this.z !== o.z) {
          this.emit('z-order', { z: o.z })
        }
        if (this.scale.x !== o.scaleX || this.scale.y !== o.scaleY) {
          this.emit('scale', { x: o.scale.x, y: o.scale.y })
        }
        if (this.skew.x !== o.skewX || this.skew.y !== o.skewY) {
          this.emit('skew', { x: o.skew.x, y: o.skew.y })
        }
        if (this.pivot.x !== o.pivotX || this.pivot.y !== o.pivotY) {
          this.emit('pivot', { x: o.pivot.x, y: o.pivot.y })
        }
        if (this.alpha !== o.alpha) {
          this.emit('alpha', { alpha: o.alpha })
        }
        if (this.visible !== o.visible) {
          this.emit('visible', { visible: o.visible })
        }
        if (this.renderable !== o.renderable) {
          this.emit('renderable', { renderable: o.renderable })
        }
        if (this.rotation !== o.rotation) {
          this.emit('rotation', { rotation: o.rotation })
        }
      }

      this._oldTransform = {
        x: this.x,
        y: this.y,
        z: this.z,
        scaleX: this.scale.x,
        scaleY: this.scale.y,
        skewX: this.skew.x,
        skewY: this.skew.y,
        pivotX: this.pivot.x,
        pivotY: this.pivot.y,
        alpha: this.alpha,
        rotation: this.rotation,
        visible: this.visible,
        renderable: this.renderable,
      }
    }

    this.emit('updatetransform')

    super.updateTransform(...arguments)
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

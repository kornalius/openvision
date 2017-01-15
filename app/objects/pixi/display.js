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

  get trackUpdateEvents () { return this._trackUpdateEvents }
  set trackUpdateEvents (value) { this._trackUpdateEvents = value }

  get left () { return this.x }
  set left (value) { this.x = value }

  get top () { return this.y }
  set top (value) { this.y = value }

  get right () { return this.x + this.width }
  set right (value) { this.width = value - this.x }

  get bottom () { return this.y + this.height }
  set bottom (value) { this.height = value - this.y }

  get centerX () { return this.x + this.halfWidth }
  set centerX (value) { this.x = value - this.halfWidth }

  get centerY () { return this.y + this.halfHeight }
  set centerY (value) { this.y = value - this.halfHeight }

  centerOn (x, y) {
    this.centerX = x
    this.centerY = y
    return this
  }

  get halfWidth () { return this.width / 2 }
  get halfHeight () { return this.height / 2 }

  get randomX () {
    if (this.x < 0) {
      return Math.random(this.x, this.width - Math.abs(this.x))
    }
    else {
      return Math.random(this.x, this.width)
    }
  }

  get randomY () {
    if (this.y < 0) {
      return Math.random(this.y, this.height - Math.abs(this.y))
    }
    else {
      return Math.random(this.y, this.height)
    }
  }

  moveTo (x, y) {
    this.position.set(x, y)
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

  floorAll () {
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    this.width = Math.floor(this.width)
    this.height = Math.floor(this.height)
    return this
  }

  ceil () {
    this.x = Math.ceil(this.x)
    this.y = Math.ceil(this.y)
    return this
  }

  ceilAll () {
    this.x = Math.ceil(this.x)
    this.y = Math.ceil(this.y)
    this.width = Math.ceil(this.width)
    this.height = Math.ceil(this.height)
    return this
  }

  resize (width, height) {
    this.width = width
    this.height = height
    return this
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
    this.emit('update', options)
    return this
  }

  updateTransform () {
    if (this._trackUpdateEvents) {
      if (this._oldTransform) {
        if (this.x !== this._oldTransform.x || this.y !== this._oldTransform.y) {
          this.emit('move', { x: this._oldTransform.x, y: this._oldTransform.y })
        }
        if (this.width !== this._oldTransform.width || this.height !== this._oldTransform.height) {
          this.emit('size', { width: this._oldTransform.width, height: this._oldTransform.height })
        }
        if (this.scale.x !== this._oldTransform.scaleX || this.scale.y !== this._oldTransform.scaleY) {
          this.emit('scale', { x: this._oldTransform.scale.x, y: this._oldTransform.scale.y })
        }
        if (this.skew.x !== this._oldTransform.skewX || this.skew.y !== this._oldTransform.skewY) {
          this.emit('skew', { x: this._oldTransform.skew.x, y: this._oldTransform.skew.y })
        }
        if (this.pivot.x !== this._oldTransform.pivotX || this.pivot.y !== this._oldTransform.pivotY) {
          this.emit('pivot', { x: this._oldTransform.pivot.x, y: this._oldTransform.pivot.y })
        }
      }
      this._oldTransform = {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        scaleX: this.scale.x,
        scaleY: this.scale.y,
        skewX: this.skew.x,
        skewY: this.skew.y,
        pivotX: this.pivot.x,
        pivotY: this.pivot.y,
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

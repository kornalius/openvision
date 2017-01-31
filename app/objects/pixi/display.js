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

    this._margin = { left: 0, top: 0, right: 0, bottom: 0 }

    this._autoSize = '' // w, h
    this._autoAlign = '' // t, l, r, b, c, m

    this._constrains = {
      min: {
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
      },
      max: {
        x: undefined,
        y: undefined,
        width: undefined,
        height: undefined,
      }
    }
  }

  destroy () {
    if (updates) {
      updates.remove(this)
    }
    super.destroy()
  }

  get layout () { return this._layout }

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

  get topLeft () { return { x: this.x, y: this.y } }
  set topLeft (value) {
    this.x = value.x
    this.y = value.y
  }

  get topRight () { return { x: this.right, y: this.y } }
  set topRight (value) {
    this.right = value.x
    this.y = value.y
  }

  get bottomLeft () { return { x: this.x, y: this.bottom } }
  set bottomLeft (value) {
    this.x = value.x
    this.bottom = value.y
  }

  get bottomRight () { return { x: this.right, y: this.bottom } }
  set bottomRight (value) {
    this.right = value.x
    this.bottom = value.y
  }

  get centerX () { return this.x + this.halfWidth }
  set centerX (value) { this.x = value - this.halfWidth }

  get centerY () { return this.y + this.halfHeight }
  set centerY (value) { this.y = value - this.halfHeight }

  constrainsValue (prop) {
    let v = _.get(this.constrains, prop, NaN)
    return v
  }

  get minX () { return this.constrainsValue('min.x') }
  get maxX () { return this.constrainsValue('max.x') }

  get minY () { return this.constrainsValue('min.y') }
  get maxY () { return this.constrainsValue('max.y') }

  get minWidth () { return this.constrainsValue('min.width') }
  get maxWidth () { return this.constrainsValue('max.width') }

  get minHeight () { return this.constrainsValue('min.height') }
  get maxHeight () { return this.constrainsValue('max.height') }

  get leftMargin () { return this.margin.left }
  get topMargin () { return this.margin.top }
  get rightMargin () { return this.margin.right }
  get bottomMargin () { return this.margin.bottom }

  get marginWidth () { return this.leftMargin + this.rightMargin }
  get marginHeight () { return this.topMargin + this.bottomMargin }

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

  get randomWidth () { return Math.random(0, this.width) }

  get randomHeight () { return Math.random(0, this.height) }

  get constrains () { return this._constrains }

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
        if (this.width !== o.width || this.height !== o.height) {
          this.emit('size', { width: o.width, height: o.height })
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
        width: this.width,
        height: this.height,
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

  layoutChildren (children) {
    // sort by children order
    children = _.sortBy(_.filter(children, c => !c.isMask), 'layout.order')
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

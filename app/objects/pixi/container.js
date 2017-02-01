import { BaseMixin } from '../base.js'
import { EmitterMixin } from '../../event.js'
import { PluginMixin } from '../../plugin.js'
import { CommandMixin } from '../../command.js'
import { ShortcutMixin } from '../../shortcut.js'
import { DisplayMixin } from './display.js'
import { DBMixin } from '../db.js'
import { jsonquery } from '../../utils.js'
import { Encoder, e, d } from '../../lib/encoder.js'


export let ContainerMixin = Mixin(superclass => class ContainerMixin extends superclass {

  constructor () {
    super(...arguments)

    this._padding = { left: 0, top: 0, right: 0, bottom: 0 }
    this._margin = { left: 0, top: 0, right: 0, bottom: 0 }

    this._align = '' // 'l', 't', 'r', 'b', 'f', 'c'

    this._anchors = 'lt' // 'l', 't', 'r', 'b'
    this._anchorRules = { x: 0, y: 0 }
    this._parentSize = { x: 0, y: 0 }

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

    this.on('mouseover', this.onMouseOver)
    this.on('mouseout', this.onMouseOut)
  }

  destroy () {
    this.off('mouseover', this.onMouseOver)
    this.off('mouseout', this.onMouseOut)

    super.destroy()
  }

  get right () { return this.x + this.width }
  set right (value) { this.width = value - this.x }

  get bottom () { return this.y + this.height }
  set bottom (value) { this.height = value - this.y }

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

  get bounds () {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      right: this.right,
      bottom: this.bottom
    }
  }

  setBounds (x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.update()
  }

  get halfWidth () { return this.width / 2 }
  get halfHeight () { return this.height / 2 }

  get centerX () { return this.x + this.halfWidth }
  set centerX (value) { this.x = value - this.halfWidth }

  get centerY () { return this.y + this.halfHeight }
  set centerY (value) { this.y = value - this.halfHeight }

  // random

  get randomX () { return Math.random(this.x, this.width - (this.x < 0 ? Math.abs(this.x) : 0)) }
  get randomY () { return Math.random(this.y, this.height - (this.y < 0 ? Math.abs(this.y) : 0)) }
  get randomWidth () { return Math.random(0, this.width) }
  get randomHeight () { return Math.random(0, this.height) }

  // margins

  get margin () { return this._margin }
  set margin (value) {
    if (_.isNumber(value)) {
      value = { left: value, top: value, right: value, bottom: value }
    }
    if (!_.isEqual(this._margin, value)) {
      this._margin = value
      this.update()
      this._updateAnchorRules()
      this._realign()
    }
  }

  get leftMargin () { return this.margin.left }
  get topMargin () { return this.margin.top }
  get rightMargin () { return this.margin.right }
  get bottomMargin () { return this.margin.bottom }

  get marginWidth () { return this.leftMargin + this.rightMargin }
  get marginHeight () { return this.topMargin + this.bottomMargin }

  get outerBounds () {
    return {
      x: this.x - this.leftMargin,
      y: this.y - this.topMargin,
      width: this.width + this.marginWidth,
      height: this.height + this.marginHeight,
      right: this.right + this.rightMargin,
      bottom: this.bottom + this.bottomMargin
    }
  }

  get outerX () { return this.x - this.leftMargin }
  get outerY () { return this.y - this.topMargin }
  get outerLeft () { return this.x - this.leftMargin }
  get outerTop () { return this.y - this.topMargin }
  get outerRight () { return this.right + this.rightMargin }
  get outerBottom () { return this.bottom + this.bottomMargin }
  get outerWidth () { return this.width + this.marginWidth }
  get outerHeight () { return this.height + this.marginHeight }

  // padding

  get padding () { return this._padding }
  set padding (value) {
    if (_.isNumber(value)) {
      value = { left: value, top: value, right: value, bottom: value }
    }
    if (!_.isEqual(this._padding, value)) {
      this._padding = value
      this.update()
      this._updateAnchorRules()
      this._realign()
    }
  }

  get leftPadding () { return this.padding.left }
  get topPadding () { return this.padding.top }
  get rightPadding () { return this.padding.right }
  get bottomPadding () { return this.padding.bottom }

  get paddingWidth () { return this.leftPadding + this.rightPadding }
  get paddingHeight () { return this.topPadding + this.bottomPadding }

  get innerBounds () {
    return {
      x: this.x + this.leftPadding,
      y: this.y + this.topPadding,
      width: this.width - this.paddingWidth,
      height: this.height - this.paddingHeight,
      right: this.right - this.rightPadding,
      bottom: this.bottom - this.bottomPadding
    }
  }

  get innerX () { return this.x + this.leftPadding }
  get innerY () { return this.y + this.topPadding }
  get innerLeft () { return this.x + this.leftPadding }
  get innerTop () { return this.y + this.topPadding }
  get innerRight () { return this.right - this.rightPadding }
  get innerBottom () { return this.bottom - this.bottomPadding }
  get innerWidth () { return this.width - this.paddingWidth }
  get innerHeight () { return this.height - this.paddingHeight }

  // constrains

  get constrains () { return this._constrains }

  constrainsValue (prop) {
    let v = _.get(this.constrains, prop, NaN)
    let parent = this.parent
    if (parent) {
      if (prop.endsWith('.width')) {
        v = parent.relWidth(v)
      }
      else if (prop.endsWith('.height')) {
        v = parent.relHeight(v)
      }
    }
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

  // alignment

  get align () { return this._align }
  set align (value) {
    if (this._align !== value) {
      this._align = value
      this.update()
      this._realign()
    }
  }

  get anchors () { return this._anchors }
  set anchors (value) {
    if (this._anchors !== value) {
      this._anchors = value
      this.update()
      this._updateAnchorRules()
      this._realign()
    }
  }

  // utils

  floorAll () {
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    this.width = Math.floor(this.width)
    this.height = Math.floor(this.height)
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

  onChildrenChange () {
    return this.emit('childrenchange', ...arguments)
  }

  onMouseOver (e) {
    app.screen.currentOver = this
    e.stopPropagation()
  }

  onMouseOut (e) {
    app.screen.currentOver = null
  }

  get root () {
    let p = this.parent
    while (p && p.parent) {
      p = p.parent
    }
    return p
  }

  each (fn, deep = false) {
    for (let c of this.children) {
      if (deep) {
        c.each(fn, deep)
      }
      fn(c)
    }
    return this
  }

  eachParent (fn) {
    let p = this.parent
    while (p) {
      if (fn(p)) {
        return p
      }
      p = p.parent
    }
    return null
  }

  maxChildrenX () { return app.maxChildrenX(this.children) }
  minChildrenX () { return app.minChildrenX(this.children) }

  maxChildrenY () { return app.maxChildrenY(this.children) }
  minChildrenY () { return app.minChildrenY(this.children) }

  maxChildrenZ () { return app.maxChildrenZ(this.children) }
  minChildrenZ () { return app.minChildrenZ(this.children) }

  maxChildrenWidth () { return app.maxChildrenWidth(this.children) }
  minChildrenWidth () { return app.minChildrenWidth(this.children) }

  maxChildrenHeight () { return app.maxChildrenHeight(this.children) }
  minChildrenHeight () { return app.minChildrenHeight(this.children) }

  maxChildrenRight () { return app.maxChildrenRight(this.children) }
  minChildrenRight () { return app.minChildrenRight(this.children) }

  maxChildrenBottom () { return app.maxChildrenBottom(this.children) }
  minChildrenBottom () { return app.minChildrenBottom(this.children) }

  relWidth (value) {
    return _.isInteger(value) ? value : value * this.innerWidth
  }

  relHeight (value) {
    return _.isInteger(value) ? value : value * this.innerHeight
  }

  alignToParent (side = 'c', stretch = false) {
    let topPadding = this.topPadding
    let leftPadding = this.leftPadding

    let parentWidth = _.get(this, 'parent.innerWidth', 0)
    let parentHeight = _.get(this, 'parent.innerHeight', 0)

    switch (side) {
      case 't':
        this.y = topPadding
        if (stretch) {
          this.x = leftPadding
          this.width = parentWidth
        }
        break

      case 'l':
        this.x = leftPadding
        if (stretch) {
          this.y = topPadding
          this.height = parentHeight
        }
        break

      case 'b':
        this.y = parentHeight - this.height
        if (stretch) {
          this.x = leftPadding
          this.width = parentWidth
        }
        break

      case 'r':
        this.x = parentWidth - this.width
        if (stretch) {
          this.y = topPadding
          this.height = parentHeight
        }
        break

      case 'tl':
        this.x = leftPadding
        this.y = topPadding
        break

      case 'tr':
        this.x = parentWidth - this.width
        this.y = topPadding
        break

      case 'bl':
        this.x = leftPadding
        this.y = parentHeight - this.height
        break

      case 'br':
        this.x = parentWidth - this.width
        this.y = parentHeight - this.height
        break

      case 'hc':
        this.x = parentWidth / 2 - this.halfWidth
        break

      case 'vc':
        this.y = parentHeight / 2 - this.halfHeight
        break

      case 'c':
        this.x = parentWidth / 2 - this.halfWidth
        this.y = parentHeight / 2 - this.halfHeight
        break
    }
    return this.update()
  }

  snapTo (containers = this.parent.children, sides = 'tlbrc', padding = 8) {
    let x = this.x
    let y = this.y

    let hor = _.sortBy(containers, 'x')
    let ver = _.sortBy(containers, 'y')
    let horCenter = _.sortBy(containers, 'centerX')
    let verCenter = _.sortBy(containers, 'centerY')

    if ('l' in sides) {
      for (let c of hor) {
        if (x <= c.right + padding && x > c.right) {
          x = c.x + 1
          break
        }
      }
    }

    if ('r' in sides) {
      for (let c of hor) {
        if (x >= c.x - padding && x < c.x) {
          x = c.x - 1
          break
        }
      }
    }

    if ('t' in sides) {
      for (let c of ver) {
        if (y <= c.bottom + padding && y > c.bottom) {
          y = c.y + 1
          break
        }
      }
    }

    if ('b' in sides) {
      for (let c of ver) {
        if (y >= c.y - padding && y < c.y) {
          y = c.y - 1
          break
        }
      }
    }

    if ('h' in sides) {
      for (let c of horCenter) {
        let cx = c.centerX
        if (x >= cx - padding && x <= cx + padding) {
          x = cx
          break
        }
      }
    }

    if ('v' in sides) {
      for (let c of verCenter) {
        let cy = c.centerY
        if (y >= cy - padding && y <= cy + padding) {
          y = cy
          break
        }
      }
    }

    this.x = x
    this.y = y

    return this.update()
  }

  _hasAnchors (anchors, sameLength = false) {
    if (sameLength && anchors.length !== this.anchors.length) {
      return false
    }
    for (let a of anchors.split('')) {
      if (this.anchors.indexOf(a) === -1) {
        return false
      }
    }
    return true
  }

  _updateAnchorRules () {
    if (!this._anchorMove) {
      if (this._hasAnchors('lt', true)) {
        return
      }

      if (this._hasAnchors('r')) {
        this._anchorRules.x = this._hasAnchors('l') ? this.width : this.x
      }
      else {
        this._anchorRules.x = this.x + this.width / 2
      }

      if (this._hasAnchors('b')) {
        this._anchorRules.y = this._hasAnchors('t') ? this.height : this.y
      }
      else {
        this._anchorRules.y = this.y + this.height / 2
      }

      this._parentSize.x = this.parent.width
      this._parentSize.y = this.parent.height
    }
  }

  _shouldInsertBefore (c1, c2, align) {
    switch (align) {
      case 't':
        return c1.top < c2.top
      case 'b':
        return c1.top + c1.Height >= c2.top + c2.Height
      case 'l':
        return c1.left < c2.left
      case 'r':
        return c1.left + c1.Width >= c2.left + c2.Width
    }
    return false
  }

  get _hasChildWithAlign () {
    for (let i = this.children.length - 1; i > 0; i--) {
      let c = this.children[i]
      if (!c.isMask && (c.align !== '' || !c._hasAnchors('lt', true))) {
        return true
      }
    }
    return false
  }

  _realign (c) {
    let rect = new PIXI.Rectangle()
    if (c && c._hasChildWithAlign) {
      rect = c._doAlignment('t', rect)
      rect = c._doAlignment('b', rect)
      rect = c._doAlignment('l', rect)
      rect = c._doAlignment('r', rect)
      rect = c._doAlignment('c', rect)
      rect = c._doAlignment('f', rect)
      rect = c._doAlignment('', rect)
    }
    return rect
  }

  _doPosition (align, rect) {
    let x
    let y
    let w
    let h
    let anchorAlign = [
      'lt',
      'ltr',
      'lrb',
      'ltb',
      'rtb',
      'ltrb',
    ]

    if (align === '' || !this._hasAnchors(anchorAlign[align], true)) {
      if (this._parentSize.x !== 0 && this._parentSize.y !== 0) {
        x = this.x
        y = this.y
        w = this.width
        h = this.height
        let parentSize = new PIXI.Point(this.parent.width, this.parent.height)

        if (this._hasAnchors('r')) {
          if (this._hasAnchors('l')) {
            w = parentSize.x - (this._parentSize.x - this._anchorRules.x)
          }
          else {
            x = parentSize.x - (this._parentSize.x - this._anchorRules.x)
          }
        }
        else if (!this._hasAnchors('l')) {
          x = this._anchorRules.x * parentSize.x / this._parentSize.x - w / 2
        }

        if (this._hasAnchors('b')) {
          if (this._hasAnchors('t')) {
            h = parentSize.y - (this._parentSize.y - this._anchorRules.y)
          }
          else {
            y = parentSize.y - (this._parentSize.y - this._anchorRules.y)
          }
        }
        else if (!this._hasAnchors('t')) {
          y = this._anchorRules.y * parentSize.y / this._parentSize.y - h / 2
        }

        this._anchorMove = true
        this.setBounds(x, y, w, h)
        this._anchorMove = false
      }

      if (align === '') {
        return rect
      }
    }

    if (align !== '') {
      w = rect.right - rect.x

      if (w < 0 || align === 'l' || align === 'r') {
        w = this.width
      }

      h = rect.bottom - rect.y
      if (h < 0 || align === 't' || align === 'b') {
        h = this.height
      }

      x = rect.x
      y = rect.y
      switch (align) {
        case 't':
          rect.y += h
          break
        case 'b':
          rect.bottom -= h
          y = rect.bottom
          break
        case 'l':
          rect.x += w
          break
        case 'r':
          rect.right -= w
          x = rect.right
          break
        case 'c':
          rect.right -= w
          x = rect.right
          break
      }

      this._anchorMove = true
      this.setBounds(x, y, w, h)
      this._anchorMove = false

      if (this.width !== w || this.height !== h) {
        switch (align) {
          case 't':
            rect.y -= h - this.height
            break
          case 'b':
            rect.bottom += h - this.height
            break
          case 'l':
            rect.x -= w - this.width
            break
          case 'r':
            rect.right += w - this.width
            break
          case 'f':
            rect.right += w - this.width
            rect.bottom += h - this.height
            break
          case 'c':
            rect.x += w - this.width
            rect.y += h - this.height
            break
        }
      }
    }

    return rect
  }

  _doAlignment (align, rect) {
    let l = []

    if (!this.isMask && (align === '' || this.visible && this.align === align)) {
      l.push(this)
    }

    for (let i = this.children.length - 1; i > 0; i--) {
      let c = this.children[i]
      if (!c.isMask && c.visible && c.align === align) {
        let j = 0
        while (j < l.length && this._shouldInsertBefore(c, l[j], align)) {
          j++
        }
        l.splice(j, 0, this)
      }
    }

    for (let c of l) {
      rect = c._doPosition(align, rect)
    }

    return rect
  }

  maximize () {
    this.x = this.parent.leftPadding
    this.y = this.parent.topPadding
    this.width = this.parent.innerWidth
    this.height = this.parent.innerHeight
    return this.update()
  }

  q (expr) { return jsonquery(expr, { data: this.root, parent: this.parent, source: this.children, allowRegexp: true }).value }

  updateTransform () {
    let o = this._oldTransform
    if (this._trackUpdateEvents) {
      if (o) {
        if (this.width !== o.width || this.height !== o.height) {
          this.emit('size', { width: o.width, height: o.height })
        }
      }
      _.extend(this._oldTransform, {
        width: this.width,
        height: this.height,
      })
    }

    super.updateTransform(...arguments)

    this._updateAnchorRules()
    this._realign()
  }

})


export class Container extends mix(PIXI.Container).with(EmitterMixin, BaseMixin, DBMixin, PluginMixin, CommandMixin, ShortcutMixin, DisplayMixin, ContainerMixin) {}


Encoder.register('Container', {
  inherit: 'Display',

  encode: obj => {
    let doc = {
      children: new Array(obj.children.length)
    }
    doc.width = e('width', obj, doc)
    doc.height = e('height', obj, doc)
    for (let i = 0; i < obj.children.length; i++) {
      doc.children[i] = e(obj.children[i], obj, doc)
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Container()
    obj.width = d('width', doc, obj)
    obj.height = d('height', doc, obj)
    for (let c of doc.children) {
      obj.addChild(d(c, doc, obj))
    }
    return obj
  },
})

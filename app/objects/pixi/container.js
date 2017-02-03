import { BaseMixin } from '../base.js'
import { EmitterMixin } from '../../event.js'
import { PluginMixin } from '../../plugin.js'
import { CommandMixin } from '../../command.js'
import { ShortcutMixin } from '../../shortcut.js'
import { DisplayMixin } from './display.js'
import { DBMixin } from '../db.js'
import { jsonquery } from '../../utils.js'
import { Encoder, e, d } from '../../lib/encoder.js'


var root_el = null


export let ContainerMixin = Mixin(superclass => class ContainerMixin extends superclass {

  constructor () {
    super(...arguments)

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

  get leftMargin () { return _.get(this, '__layout.leftMargin', 0) }
  get topMargin () { return _.get(this, '__layout.topMargin', 0) }
  get rightMargin () { return _.get(this, '__layout.rightMargin', 0) }
  get bottomMargin () { return _.get(this, '__layout.bottomMargin', 0) }
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

  get leftPadding () { return _.get(this, '__layout.leftPadding', 0) }
  get topPadding () { return _.get(this, '__layout.topPadding', 0) }
  get rightPadding () { return _.get(this, '__layout.rightPadding', 0) }
  get bottomPadding () { return _.get(this, '__layout.bottomPadding', 0) }
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

  get minWidth () { return _.get(this, '__layout.minWidth', 0) }
  get minHeight () { return _.get(this, '__layout.minHeight', 0) }
  get maxWidth () { return _.get(this, '__layout.maxWidth', 0) }
  get maxHeight () { return _.get(this, '__layout.maxHeight', 0) }

  _createElement () {
    let el = this._el
    if (!el) {
      el = document.createElement('div')
      el.id = this.constructor.name
      el._host = this
      this._el = el

      // create root div element
      if (!root_el) {
        let view = app.screen.view
        root_el = document.createElement('div')
        root_el.id = 'layout_root'
        let s = root_el.style
        s.display = 'block'
        s.position = 'fixed'
        s.left = '0px'
        s.top = '0px'
        s.width = view.width + 'px'
        s.height = view.height + 'px'
        s.zIndex = '-1'
        document.body.appendChild(root_el)
      }

      let parent = this.parent
      if (parent && parent !== app.stage) {
        let parent_el = parent._el
        if (!parent_el) {
          parent_el = parent._createElement()
        }
        parent_el.appendChild(el)
      }
      else {
        root_el.appendChild(el)
      }
    }

    this.relayout()

    return el
  }

  _destroyElement () {
    let el = this._el
    if (el) {
      el.remove()
      el = null

      if (root_el && root_el.children.length === 0) {
        root_el.remove()
        root_el = null
      }
    }
  }

  _udpateElement () {
    let el = this._el
    if (el) {
      let s = el.style
      let scale = app.screen.scale

      s.display = 'block'

      if (this.__layout) {
        this.__layout.updateElement()
      }

      s.position = s.display === 'block' ? 'relative' : 'absolute'

      s.left = this.x * scale + 'px'
      s.top = this.y * scale + 'px'
      s.width = this.width * scale + 'px'
      s.height = this.height * scale + 'px'
    }
  }

  relayout () {
    let el = this._el
    if (el) {
      let scale = app.screen.scale

      this._udpateElement()

      this.x = el.offsetLeft / scale
      this.y = el.offsetTop / scale
      this.width = el.offsetWidth / scale
      this.height = el.offsetHeight / scale

      this.update()
    }
  }

  updateTransform () {
    let o = this._oldTransform
    let w = this._width
    let h = this._height

    if (this._trackUpdateEvents && o) {
      if (w !== o.width || h !== o.height) {
        this.emit('size', { width: o.width, height: o.height })
      }
    }

    super.updateTransform(...arguments)

    _.extend(o, {
      width: w,
      height: h,
    })

    this.relayout()
  }

  q (expr) { return jsonquery(expr, { data: this.root, parent: this.parent, source: this.children, allowRegexp: true }).value }

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

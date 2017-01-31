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

    this._autoArrange = '' // h, v
    this._wrap = false

    this.on('mouseover', this.onMouseOver)
    this.on('mouseout', this.onMouseOut)
  }

  destroy () {
    this.off('mouseover', this.onMouseOver)
    this.off('mouseout', this.onMouseOut)
    super.destroy()
  }

  get padding () { return this._padding }
  set padding (value) {
    if (_.isNumber(value)) {
      value = { left: value, top: value, right: value, bottom: value }
    }
    if (!_.isEqual(this._padding, value)) {
      this._padding = value
      this.update()
    }
  }

  constrainsValue (prop) {
    let v = super.constrainsValue(prop)
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

  get innerWidth () { return this.width - this.paddingWidth }
  get innerHeight () { return this.height - this.paddingHeight }

  get leftPadding () { return this.padding.left }
  get topPadding () { return this.padding.top }
  get rightPadding () { return this.padding.right }
  get bottomPadding () { return this.padding.bottom }

  get paddingWidth () { return this.leftPadding + this.rightPadding }
  get paddingHeight () { return this.topPadding + this.bottomPadding }

  relWidth (value) {
    return _.isInteger(value) ? value : value * this.innerWidth
  }

  relHeight (value) {
    return _.isInteger(value) ? value : value * this.innerHeight
  }

  align (side = 'c', stretch = false) {
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

  snap (containers = this.parent.children, sides = 'tlbrc', padding = 8) {
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

  layout () {
    let autoSize = this.autoSize
    let leftMargin = this.leftMargin
    let topMargin = this.topMargin
    let maxWidth = this.maxWidth
    let maxHeight = this.maxHeight
    let innerWidth = this.innerWidth
    let innerHeight = this.innerHeight

    let aktX = 0
    let aktY = 0
    let newX = 0
    let newY = 0
    let maxY = 0
    let newMaxX = 0
    let controlMaxX = 0
    let controlMaxY = 0
    let tmpWidth = 0
    let tmpHeight = 0
    let oldHeight = 0
    let oldWidth = 0
    let offsetX = 0
    let offsetY = 0
    let perLine = 0
    let rects = []
    let offsets = []
    let lineCount = 0
    let len = 0

    if (this._autoArrange) {
      this._arrangeWidth = 0
      this._arrangeHeight = 0
      this._arranging = true

      oldHeight = this.height
      oldWidth = this.width
      tmpHeight = this.height
      tmpWidth = this.width
      aktY = topMargin
      aktX = leftMargin
      maxY = -1

      controlMaxX = autoSize in ['w', 'wh'] ? tmpWidth - 2 * leftMargin : -1
      controlMaxY = autoSize in ['h', 'wh'] ? tmpHeight - 2 * topMargin : -1

      let children = _.sortBy(_.filter(this.children, c => !c.isMask && c.visible), 'layout.order')

      rects = new Array(children.length)

      for (let c of children) {
        if (c instanceof Container) {
          c.layout()
        }
        if (c.width + 2 * leftMargin > tmpWidth) {
          tmpWidth = c.width + 2 * leftMargin
        }
      }

      if (tmpWidth > maxWidth && maxWidth > 0) {
        tmpWidth = maxWidth
      }

      perLine = 0
      lineCount = 0
      for (let i = 0; i < children.length; i++) {
        let c = children[i]
        rects[i].control = null
        rects[i].lineBreak = false
        newMaxX = leftMargin + aktX + c.width + c.rightMargin

        if (((newMaxX > tmpWidth && !(autoSize in ['w', 'wh']) || newMaxX > maxWidth && maxWidth > 0)) &&
            aktX > leftMargin && this.wrap) {
          aktX = leftMargin + c.leftMargin
          aktY = aktY + maxY + c.topMargin
          maxY = -1
          newX = aktX
          newY = aktY
          perLine = 1
          rects[i].lineBreak = true
          lineCount++
        }
        else {
          newX = aktX
          newY = aktY
          perLine++
        }

        aktX += c.width
        if (aktX > controlMaxX) {
          controlMaxX = aktX
        }
        aktX += c.rightMargin

        rects[i].control = c
        rects[i].boundsRect = { x: newX, y: newY, width: newX + c.width, height: newY + c.height }
        if (c.height > maxY) {
          maxY = c.height
        }

        controlMaxY = aktY + maxY
      }

      if (rects.length > 0 && !_.last(rects).lineBreak) {
        lineCount++
      }

      // Vertical / Horizontal alignment
      let offsetX = 0
      let offsetY = 0
      if (!(autoSize in ['wh', 'h'])) {
        switch (layout.VerticalAlignment) {
          case 'm':
            offsetY = (innerHeight - controlMaxY) / 2
            break
          case 'b':
            offsetY = innerHeight - controlMaxY
            break
        }
      }

      if (!(autoSize in ['wh', 'w'])) {
        switch (layout.HorizontalAlignment) {
          case 'c':
            offsetX = (innerWidth - controlMaxX) / 2
            break
          case 'r':
            offsetX = innerWidth - controlMaxX
            break
        }
      }

      // Calculate the horizontal line alignment
      if (layout.HorizontalAlignLines) {
        offsets = new Array(lineCount)
        len = rects.length
        i = 0
        lineCount = 0
        while (i < len) {
          // Skip unused slots
          while (i < len && rects[i].control === null) {
            i++
          }
          if (i < len) {
            offsets[lineCount] = rects[i].boundsRect.x
            // Find last control in the line
            while (i + 1 < len && !rects[i + 1].lineBreak) {
              i++
            }
            offsets[lineCount] = (controlMaxX - (rects[i].boundsRect.x + rects[i].boundsRect.width - offsets[lineCount])) / 2
            lineCount++
          }
          i++
        }
      }

      // Apply the new BoundRects to the controls
      lineCount = 0
      for (let i = 0; i < rects.length; i++) {
        if (rects[i].control !== null) {
          OffsetRect(rects[i].boundsRect, offsetX, offsetY)
          if (layout.HorizontalAlignLines) {
            if (rects[i].lineBreak) {
              lineCount++
            }
            OffsetRect(rects[i].boundsRect, offsets[lineCount], 0)
          }
          SetControlBounds(rects[i].control, rects[i].boundsRect)
        }
      }

      // Adjust panel bounds
      if (autoSize in ['w', 'wh']) {
        if (controlMaxX >= 0) {
          if (maxWidth > 0 && controlMaxX >= maxWidth) {
            tmpWidth = maxWidth
          }
          else {
            tmpWidth = controlMaxX + leftMargin
          }
        }
        else {
          tmpWidth = 0
        }
      }

      if (autoSize in ['h', 'wh']) {
        if (controlMaxY >= 0) {
          tmpHeight = controlMaxY + topMargin
        }
        else {
          tmpHeight = 0
        }
      }

      if (this.width !== tmpWidth) {
        this.width = tmpWidth
      }

      if (this.height !== tmpHeight) {
        this.height = tmpHeight
      }

      this._arrangeWidth = controlMaxX + 2 * leftMargin
      this._arrangeHeight = controlMaxY + 2 * topMargin

      if (oldWidth !== tmpWidth || oldHeight !== this.height) {
        this.UpdateWindow(Handle)
      }

      this._arranging = false
    }
  }
  maximize () {
    this.x = this.parent.leftPadding
    this.y = this.parent.topPadding
    this.width = this.parent.innerWidth
    this.height = this.parent.innerHeight
    return this.update()
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
    for (let i = 0; i < obj.children.length; i++) {
      doc.children[i] = e(obj.children[i], obj, doc)
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Container()
    for (let c of doc.children) {
      obj.addChild(d(c, doc, obj))
    }
    return obj
  },
})

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

  maxX (group) { return _.maxBy(group || this.children, 'x') }
  minX (group) { return _.minBy(group || this.children, 'x') }

  maxY (group) { return _.maxBy(group || this.children, 'y') }
  minY (group) { return _.minBy(group || this.children, 'y') }

  maxZ (group) { return _.maxBy(group || this.children, 'z') }
  minZ (group) { return _.minBy(group || this.children, 'z') }

  maxWidth (group) { return _.maxBy(group || this.children, 'width') }
  minWidth (group) { return _.minBy(group || this.children, 'width') }

  maxHeight (group) { return _.maxBy(group || this.children, 'height') }
  minHeight (group) { return _.minBy(group || this.children, 'height') }

  maxRight (group) { return _.maxBy(group || this.children, 'right') }
  minRight (group) { return _.minBy(group || this.children, 'right') }

  maxBottom (group) { return _.maxBy(group || this.children, 'bottom') }
  minBottom (group) { return _.minBy(group || this.children, 'bottom') }

  get innerWidth () { return this.width - this.paddingWidth }
  get innerHeight () { return this.height - this.paddingHeight }

  get leftPadding () { return this.padding.left }
  get topPadding () { return this.padding.top }
  get rightPadding () { return this.padding.right }
  get bottomPadding () { return this.padding.bottom }

  get paddingWidth () { return this.leftPadding + this.rightPadding }
  get paddingHeight () { return this.topPadding + this.bottomPadding }

  relWidth (value) {
    return _.isInteger(value) ? value : value * this.parent.innerWidth
  }

  relHeight (value) {
    return _.isInteger(value) ? value : value * this.parent.innerHeight
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

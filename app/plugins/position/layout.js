
export default class Layout extends Plugin {

  constructor () {
    super()
    this.name = 'layout'
    this.desc = 'Allow automating layouting children of a container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = []
    this.properties = {
      dir: { value: undefined, update: this.relayout },
      order: { value: 0, update: this.relayout },
      wrap: { value: true, update: this.relayout },
      align: {
        value: {
          items: 'start',
          self: 'start',
          content: 'start',
        },
        update: this.relayout
      },
      justify: { value: 'start', update: this.relayout },
      grow: { value: { width: 0, height: 0 }, update: this.relayout },
      padding: { value: { left: 0, top: 0, right: 0, bottom: 0 }, update: this.setPadding },
      margin: { value: { left: 0, top: 0, right: 0, bottom: 0 }, update: this.setMargin },
      constrains: {
        value: {
          min: {
            width: undefined,
            height: undefined,
          },
          max: {
            width: undefined,
            height: undefined,
          },
        },
        update: this.relayout
      },
    }
  }

  attach ($, options) {
    $._createElement()
    $.relayout()
  }

  detach ($) {
    $._destroyElement()
  }

  get horizontal () { return this.dir === 'h' }

  get vertical () { return this.dir === 'v' }

  setMargin (value) {
    if (_.isNumber(value)) {
      value = { left: value, top: value, right: value, bottom: value }
    }
    if (!_.isEqual(this._margin, value)) {
      this._margin = value
      this.relayout()
    }
  }

  get leftMargin () { return this.margin.left }
  get topMargin () { return this.margin.top }
  get rightMargin () { return this.margin.right }
  get bottomMargin () { return this.margin.bottom }
  get marginWidth () { return this.leftMargin + this.rightMargin }
  get marginHeight () { return this.topMargin + this.bottomMargin }

  get outerBounds () {
    let $ = this.$
    return {
      x: $.x - this.leftMargin,
      y: $.y - this.topMargin,
      width: $.width + this.marginWidth,
      height: $.height + this.marginHeight,
      right: $.right + this.rightMargin,
      bottom: $.bottom + this.bottomMargin
    }
  }

  get outerX () { return this.$.x - this.leftMargin }
  get outerY () { return this.$.y - this.topMargin }
  get outerLeft () { return this.$.x - this.leftMargin }
  get outerTop () { return this.$.y - this.topMargin }
  get outerRight () { return this.$.right + this.rightMargin }
  get outerBottom () { return this.$.bottom + this.bottomMargin }
  get outerWidth () { return this.$.width + this.marginWidth }
  get outerHeight () { return this.$.height + this.marginHeight }

  setPadding (value) {
    if (_.isNumber(value)) {
      value = { left: value, top: value, right: value, bottom: value }
    }
    if (!_.isEqual(this._padding, value)) {
      this._padding = value
      this.relayout()
    }
  }

  get leftPadding () { return this.padding.left }
  get topPadding () { return this.padding.top }
  get rightPadding () { return this.padding.right }
  get bottomPadding () { return this.padding.bottom }
  get paddingWidth () { return this.leftPadding + this.rightPadding }
  get paddingHeight () { return this.topPadding + this.bottomPadding }

  get innerBounds () {
    let $ = this.$
    return {
      x: $.x + this.leftPadding,
      y: $.y + this.topPadding,
      width: $.width - this.paddingWidth,
      height: $.height - this.paddingHeight,
      right: $.right - this.rightPadding,
      bottom: $.bottom - this.bottomPadding
    }
  }

  get innerX () { return this.$.x + this.leftPadding }
  get innerY () { return this.$.y + this.topPadding }
  get innerLeft () { return this.$.x + this.leftPadding }
  get innerTop () { return this.$.y + this.topPadding }
  get innerRight () { return this.$.right - this.rightPadding }
  get innerBottom () { return this.$.bottom - this.bottomPadding }
  get innerWidth () { return this.$.width - this.paddingWidth }
  get innerHeight () { return this.$.height - this.paddingHeight }

  get minWidth () { return this.constrains.min.width }
  get minHeight () { return this.constrains.min.height }
  get maxWidth () { return this.constrains.max.width }
  get maxHeight () { return this.constrains.max.height }

  _flexStyle (v) {
    switch (v) {
      case 'start':
        return 'flex-start'
      case 'end':
        return 'flex-end'
      case 'center':
        return 'center'
      case 'between':
        return 'space-between'
      case 'around':
        return 'space-around'
      case 'stretch':
        return 'stretch'
    }
    return ''
  }

  _rectStyle (r) {
    if (r.top === 0 && r.left === 0 && r.bottom === 0 && r.right === 0) {
      return '0'
    }
    else {
      return _.template('{{r.top * scale}}px {{r.right * scale}}px {{r.bottom * scale}}px {{r.left * scale}}px')({ r, scale: app.screen.scale })
    }
  }

  _sizeStyle (sz) {
    return sz > 0 ? sz * app.screen.scale + 'px' : ''
  }

  updateElement () {
    let $ = this.$
    let el = $._el
    if (el) {
      let s = el.style

      s.display = this.dir ? 'flex' : 'block'

      s.flexDirection = this.dir === 'h' ? 'row' : 'column'
      s.order = this.order
      s.flexGrow = this.grow
      s.flexShrink = this.shrink
      s.flexWrap = this.wrap ? 'wrap' : 'nowrap'
      s.alignItems = this._flexStyle(this.align.items)
      s.alignSelf = this._flexStyle(this.align.self)
      s.alignContent = this._flexStyle(this.align.content)
      s.justifyContent = this._flexStyle(this.justify)
    }
  }

  relayout () {
    this.$.relayout()
  }

  alignToParent (side = 'c', stretch = false) {
    let $ = this.$

    if ($.parent) {
      let left = $.parent.leftPadding
      let top = $.parent.topPadding
      let width = $.parent.innerWidth
      let height = $.parent.innerHeight

      switch (side) {
        case 't':
          $.y = top
          if (stretch) {
            $.x = left
            $.width = width
          }
          break

        case 'l':
          $.x = left
          if (stretch) {
            $.y = top
            $.height = height
          }
          break

        case 'b':
          $.y = height - $.height
          if (stretch) {
            $.x = left
            $.width = width
          }
          break

        case 'r':
          $.x = width - $.width
          if (stretch) {
            $.y = top
            $.height = height
          }
          break

        case 'tl':
          $.x = left
          $.y = top
          break

        case 'tr':
          $.x = width - $.width
          $.y = top
          break

        case 'bl':
          $.x = left
          $.y = height - $.height
          break

        case 'br':
          $.x = width - $.width
          $.y = height - $.height
          break

        case 'hc':
          $.x = width / 2 - $.halfWidth
          break

        case 'vc':
          $.y = height / 2 - $.halfHeight
          break

        case 'c':
          $.x = width / 2 - $.halfWidth
          $.y = height / 2 - $.halfHeight
          break
      }

      $.update()
    }

    return this
  }

  snapTo (containers, sides = 'tlbrc', padding = 8) {
    let $ = this.$

    containers = containers || $.parent ? $.parent.children : []

    let x = $.x
    let y = $.y

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

    $.x = x
    $.y = y

    $.update()

    return this
  }

  maximize () {
    let $ = this.$

    if ($.parent) {
      $.x = $.parent.left
      $.y = $.parent.top
      $.width = $.parent.innerWidth
      $.height = $.parent.innerHeight
      $.update()
    }

    return this
  }

}

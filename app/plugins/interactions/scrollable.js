
export default class Scrollable extends Plugin {

  constructor () {
    super()
    this.name = 'scrollable'
    this.desc = 'Allow container to be scrolled around.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['interactive', 'mouse', 'keyboard']
    this.properties = {
      top: { value: 0, options: true, update: this._scroll },
      left: { value: 0, options: true, update: this._scroll },
      right: { get: function right () { return this.left + this.$.width } },
      bottom: { get: function bottom () { return this.top + this.$.height } },
      width: { get: function width () {
        if (_.isUndefined(this._width)) {
          let w = 0
          for (let c of this.$.children) {
            if (!c.isMask) {
              let r = c.right + this.left
              if (r > w) {
                w = r
              }
            }
          }
          this._width = w + this.$.rightPadding
        }
        return this._width
      } },
      height: { get: function height () {
        if (_.isUndefined(this._height)) {
          let h = 0
          for (let c of this.$.children) {
            if (!c.isMask) {
              let b = c.bottom + this.top
              if (b > h) {
                h = b
              }
            }
          }
          this._height = h + this.$.bottomPadding
        }
        return this._height
      } },
      stepX: { value: 1, options: true, update: this._scroll },
      stepY: { value: 1, options: true, update: this._scroll },
    }
    this.listeners = {
      $scroll: this.onScroll,
      $childrenchange: this._scroll,
      $updatetransform: this.onUpdateTransform,
    }
  }

  attach ($, options = {}) {
    this._prevLeft = 0
    this._prevTop = 0

    let mask = new app.Rectangle($.width, $.height)
    mask.isMask = true
    $.mask = mask
    $.addChild(mask)
  }

  detach ($) {
    if ($.mask) {
      $.mask.destroy()
      $.mask = null
    }
  }

  scrollBy (x = 0, y = 0) {
    return this.scrollTo(this.left + x, this.top + y)
  }

  scrollTo (x = 0, y = 0) {
    if (this.left !== this._prevLeft || this.top !== this._prevTop) {
      this.left = x
      this.top = y
      this._scroll()
    }
    return this
  }

  _scroll () {
    let dx = this.left - this._prevLeft
    let dy = this.top - this._prevTop
    this._prevLeft = this.left
    this._prevTop = this.top
    for (let c of this.$.children) {
      if (!c.isMask) {
        c.x -= dx
        c.y -= dy
        c.update()
      }
    }
    this.$.update()
    return this
  }

  get horizontal () { return this.stepX > 0 && this.width > this.$.width }

  get vertical () { return this.stepY > 0 && this.height > this.$.height }

  onScroll (e) {
    if (this.vertical && e.data.wheelDelta.x === 0) {
      let h = this.height - this.$.height
      this.top -= e.data.wheelDelta.y
      if (this.top < 0) {
        this.top = 0
      }
      else if (this.top > h) {
        this.top = h
      }
    }

    if (this.horizontal && e.data.wheelDelta.y === 0) {
      let w = this.width - this.$.width
      this.left -= e.data.wheelDelta.x
      if (this.left < 0) {
        this.left = 0
      }
      else if (this.left > w) {
        this.left = w
      }
    }

    this._scroll()

    e.stopPropagation()
  }

  onUpdateTransform () {
    this._width = undefined
    this._height = undefined
  }

}

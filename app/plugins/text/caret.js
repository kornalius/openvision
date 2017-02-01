
export default class Caret extends Plugin {

  constructor () {
    super()
    this.name = 'caret'
    this.desc = 'Creates a text caret.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['editable']
    this.properties = {
      x: { value: 0 },
      y: { value: 0 },
      style: { value: 'vline', set: this.setStyle },
      color: { value: 0xFFFFFF, set: this.setColor },
      alpha: { value: 1, set: this.setAlpha },
      visible: { value: true, set: this.setVisible },
      speed: { value: 500, set: this.setSpeed },
      wrap: { value: true },
    }
    this.listeners = {
      $mousedown: this.onMousedown,
      $mousemove: this.onMousemove,
      $focus: this.onFocus,
      $blur: this.onBlur,
    }
  }

  attach ($, options = {}) {
    let c = this._shape = new app.Rectangle(this.viewWidth, this.viewHeight)
    c.color = this._color
    c.alpha = this._alpha
    c.visible = this.canShow

    this.reshape()

    $.addChild(c)

    this.set(this._x, this._y)
  }

  detach ($) {
    clearInterval(this._interval)
    $.removeChild(this._shape)
    $.update()
  }

  setStyle (value) {
    if (_.includes(['vline', 'block', 'underline'])) {
      this._style = value
    }
    this.reshape()
  }

  setColor (value) {
    this._color = value
    this._shape.color = value
    this.reshape()
  }

  setAlpha (value) {
    this._alpha = value
    this._shape.alpha = value
    this.reshape()
  }

  reshape () {
    let c = this._shape
    c.width = this.viewWidth
    c.height = this.viewHeight
    c.color = this._color
    c.alpha = this._alpha
    c.update()
    return this
  }

  get viewLeft () {
    return _.includes(['vline', 'underline'], this._style) ? -1 : 0
  }

  get viewTop () {
    return this._style === 'underline' ? this.height - this.viewHeight : 0
  }

  get viewWidth () {
    return this._style === 'vline' ? 3 : this.width + (this._style === 'underline' ? 1 : 0)
  }

  get viewHeight () {
    return this._style === 'underline' ? 3 : this.height
  }

  get width () { return 0 }

  get height () { return 0 }

  minX (y) { return 0 }

  minY (x) { return 0 }

  maxX (y) { return 0 }

  maxY (x) { return 0 }

  fromPixel (x, y) {
    if (this.style === 'vline') {
      x = Math.ceil((x - this.width * 0.25) / this.width)
    }
    else {
      x = Math.trunc(x / this.width)
    }
    y = Math.trunc(y / this.height)
    return { x, y }
  }

  toPixel (x, y) {
    x *= this.width
    y *= this.height
    return { x, y }
  }

  setSpeed (ms) {
    this._speed = ms
  }

  setVisible (value) {
    this._visible = value
    this._shape.visible = value
    this._shape.update()
    return this
  }

  get canShow () { return this._visible && this.$.__focusable.focused }

  blink () {
    this._shape.visible = !this.canShow ? false : !this._shape.visible
    this._shape.update()
    return this
  }

  startBlink () {
    this.stopBlink()
    this._interval = setInterval(this.blink.bind(this), this._speed)
    this._shape.visible = this.canShow
    this._shape.update()
    return this
  }

  stopBlink () {
    clearInterval(this._interval)
    this._shape.visible = this.canShow
    this._shape.update()
    return this
  }

  set (x, y) {
    let minX = this.minX(y)
    let maxX = this.maxX(y)

    let minY = this.minY(x)
    let maxY = this.maxY(x)

    if (this._wrap) {
      if (x > maxX && y < maxY) {
        y++
        let omaxX = maxX
        minX = this.minX(y)
        maxX = this.maxX(y)
        x = minX + (x - omaxX - 1)
      }
      else if (x < minX && y > minY) {
        y--
        minX = this.minX(y)
        maxX = this.maxX(y)
        x = maxX + x + 1
      }
    }

    y = Math.max(minY, Math.min(maxY, y))
    x = Math.max(minX, Math.min(maxX, x))

    if (x !== this._x || y !== this._y) {
      this._x = x
      this._y = y
      this._shape.position.set(x * this.width + this.viewLeft, y * this.height + this.viewTop)
      this._shape.visible = this.canShow
      this._shape.update()
    }

    return this
  }

  by (bx, by) {
    return this.set(this._x + bx, this._y + by)
  }

  left (bx = 1) {
    return this.set(this._x - bx, this._y)
  }

  right (bx = 1) {
    return this.set(this._x + bx, this._y)
  }

  up (by = 1) {
    return this.set(this._x, this._y - by)
  }

  down (by = 1) {
    return this.set(this._x, this._y + by)
  }

  bol () {
    return this.set(this.minX(this._y), this._y)
  }

  eol () {
    return this.set(this.maxX(this._y), this._y)
  }

  nextLine () {
    return this.bol().down()
  }

  onMousedown (e) {
    let info = app.mouseEvent(e)
    if (info.target === this.$) {
      if (this.$.pressed) {
        let { x, y } = this.fromPixel(info.x, info.y)
        this.set(x, y)
      }
    }
  }

  onMousemove (e) {
    let info = app.mouseEvent(e)
    if (info.target === this.$) {
      if (this.$.pressed) {
        let { x, y } = this.fromPixel(info.x, info.y)
        this.set(x, y)
      }
    }
  }

  onFocus () {
    this.startBlink()
  }

  onBlur () {
    this.stopBlink()
  }
}


export default class Caret extends Plugin {

  constructor () {
    super()
    this.name = 'caret'
    this.desc = 'Creates a text caret.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['editable']
    this.properties = {
      x: { value: 0, options: 'x' },
      y: { value: 0, options: 'y' },
      style: { value: 'vline', options: 'style', set: this.setStyle },
      color: { value: 0xFFFFFF, options: 'color', set: this.setColor },
      alpha: { value: 1, options: 'alpha', set: this.setAlpha },
      show: { value: true, options: 'visible', set: this.setVisible },
      speed: { value: 500, options: 'speed', set: this.setSpeed },
      wrap: { value: false, options: 'wrap' },
    }
    this.listeners = {
      $mousedown: this.onMousedown,
      $mousemove: this.onMousemove,
      $focus: this.onFocus,
      $blur: this.onBlur,
    }
  }

  get text () { return this.owner.textbuffer }

  init (owner, options = {}) {
    let c = this._shape = new app.Rectangle(this.viewWidth, this.viewHeight)
    c.color = this._color
    c.alpha = this._alpha
    c.visible = this.canShow

    this.reshape()

    owner.addChild(c)

    this.set(this._x, this._y)
  }

  destroy (owner) {
    clearInterval(this._interval)
    owner.removeChild(this._shape)
    owner.update()
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
    return this.owner.update()
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
    if (this.canShow) {
      this.startBlink()
    }
  }

  setVisible (value) {
    this._show = value
    this.startBlink()
  }

  get canShow () { return this._show && (!this.owner.focusable || this.owner.focusable.focused) }

  blink () {
    this._shape.visible = !this._show ? false : !this._shape.visible
    return this.owner.update()
  }

  startBlink () {
    this.stopBlink()
    this._interval = setInterval(this.blink.bind(this), this._speed)
  }

  stopBlink () {
    clearInterval(this._interval)
  }

  set visible (value) {
    this._shape.visible = value
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
      this._y = y
      this._x = x

      this._shape.position.set(x * this.width + this.viewLeft, y * this.height + this.viewTop)
      this._shape.visible = this.canShow

      return this.owner.update()
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
    return this.moveCaretBol().moveCaretDown()
  }

  onMousedown (e) {
    let info = app.mouseEvent(e)
    if (info.target === this.owner) {
      if (this.owner._pressed.down) {
        let { x, y } = this.fromPixel(info.x, info.y)
        this.set(x, y)
      }
    }
  }

  onMousemove (e) {
    let info = app.mouseEvent(e)
    if (info.target === this.owner) {
      if (this.owner._pressed.down) {
        let { x, y } = this.fromPixel(info.x, info.y)
        this.set(x, y)
      }
    }
  }

  onFocus () {
    this._visible = true
    this.startBlink()
    this.owner.update()
  }

  onBlur () {
    this._visible = false
    this.stopBlink()
    this.owner.update()
  }
}

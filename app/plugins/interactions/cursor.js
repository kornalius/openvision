
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'cursor'
    this._desc = 'Creates a cursor.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/17/2016'
    this._interface = {
      cursorWidth: { declared: true },
      cursorHeight: { declared: true },
      cursorMaxX: { declared: true },
      cursorMaxY: { declared: true },
    }
  }

  load (obj, options = {}) {
    super.load(obj, options)
    if (obj.__cursor) {
      obj._cursor = new app.Rectangle(obj.cursorWidth, obj.cursorHeight, _.get(options, 'color', 0xFFFFFF), _.get(options, 'alpha', 255))
      obj.addChild(obj._cursor)

      obj._cursor._interval = 0

      obj.cursorVisible = _.get(options, 'visible', true)
      obj.cursorBlink = _.get(options, 'blink', 500)

      obj.moveCursor(_.get(options, 'x', 0), _.get(options, 'y', 0))

      obj.on('mousedown', obj.onMouseDownCursor)
      obj.on('mousemove', obj.onMouseMoveCursor)
    }
  }

  unload (obj) {
    clearInterval(obj._cursor._interval)
    obj.removeChild(obj._cursor)
    delete obj._cursor
    if (_.isFunction(obj.update)) {
      obj.update()
    }
    obj.off('mousedown', obj.onMouseDownCursor)
    obj.off('mousemove', obj.onMouseMoveCursor)
    super.unload(obj)
  }

  blinkCursor () {
    this._cursor.visible = !this._cursor.visible
    if (!this._cursor._show) {
      this._cursor.visible = false
    }
    this.update()
  }

  get cursorWidth () { return 0 }
  get cursorHeight () { return 0 }

  get cursorMaxX () { return 0 }
  get cursorMaxY () { return 0 }

  get cursorX () { return this._cursor._posX }
  get cursorY () { return this._cursor._posY }

  get cursorBlink () { return this._cursor._blink }
  set cursorBlink (ms) {
    this._cursor._blink = ms
    clearInterval(this._cursor._interval)
    this._cursor._interval = setInterval(this.blinkCursor.bind(this), this._cursor._blink)
  }

  get cursorVisible () { return this._cursor._show }
  set cursorVisible (value) {
    this._cursor._show = value
  }

  moveCursor (x, y) {
    y = Math.max(0, Math.min(this.cursorMaxY, y))
    this._cursor._posY = y

    x = Math.max(0, Math.min(this.cursorMaxX, x))
    this._cursor._posX = x

    this._cursor.x = x * this.cursorWidth
    this._cursor.y = y * this.cursorHeight

    this._cursor.visible = this._cursor._show

    this.update()
  }

  pixelToCursor (x, y) {
    x = Math.trunc(x / this.cursorWidth)
    y = Math.trunc(y / this.cursorHeight)
    return { x, y }
  }

  cursorToPixel (x, y) {
    x *= this.cursorWidth
    y *= this.cursorHeight
    return { x, y }
  }

  onMouseDownCursor (e) {
    let info = app.mouseInfo(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let { x, y } = this.pixelToCursor(info.x, info.y)
        this.moveCursor(x, y)
      }
    }
  }

  onMouseMoveCursor (e) {
    let info = app.mouseInfo(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let { x, y } = this.pixelToCursor(info.x, info.y)
        this.moveCursor(x, y)
      }
    }
  }

}

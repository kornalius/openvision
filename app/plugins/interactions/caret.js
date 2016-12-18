
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'caret'
    this._desc = 'Creates a text caret.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/17/2016'
    this._interface = {
      caretWidth: { declared: true },
      caretHeight: { declared: true },
      caretMaxX: { declared: true },
      caretMaxY: { declared: true },
    }
    this._deps = ['editable']
  }

  load (obj, options = {}) {
    super.load(obj, options)
    if (obj.__caret) {
      obj._caret = new app.Rectangle(obj.caretWidth, obj.caretHeight, _.get(options, 'color', 0xFFFFFF), _.get(options, 'alpha', 255))
      obj.addChild(obj._caret)

      obj._caret._interval = 0

      obj.caretVisible = _.get(options, 'visible', true)
      obj.caretBlink = _.get(options, 'blink', 500)

      obj.moveCaret(_.get(options, 'x', 0), _.get(options, 'y', 0))

      obj.on('mousedown', obj.onMouseDownCaret)
      obj.on('mousemove', obj.onMouseMoveCaret)
    }
  }

  unload (obj) {
    clearInterval(obj._caret._interval)
    obj.removeChild(obj._caret)
    delete obj._caret
    if (_.isFunction(obj.update)) {
      obj.update()
    }
    obj.off('mousedown', obj.onMouseDownCaret)
    obj.off('mousemove', obj.onMouseMoveCaret)
    super.unload(obj)
  }

  blinkCaret () {
    this._caret.visible = !this._caret.visible
    if (!this._caret._show) {
      this._caret.visible = false
    }
    this.update()
  }

  get caretWidth () { return 0 }
  get caretHeight () { return 0 }

  get caretMaxX () { return 0 }
  get caretMaxY () { return 0 }

  get caretX () { return this._caret._posX }
  get caretY () { return this._caret._posY }

  get caretBlink () { return this._caret._blink }
  set caretBlink (ms) {
    this._caret._blink = ms
    clearInterval(this._caret._interval)
    this._caret._interval = setInterval(this.blinkCaret.bind(this), this._caret._blink)
  }

  get caretVisible () { return this._caret._show }
  set caretVisible (value) {
    this._caret._show = value
  }

  moveCaret (x, y) {
    y = Math.max(0, Math.min(this.caretMaxY, y))
    this._caret._posY = y

    x = Math.max(0, Math.min(this.caretMaxX, x))
    this._caret._posX = x

    this._caret.x = x * this.caretWidth
    this._caret.y = y * this.caretHeight

    this._caret.visible = this._caret._show

    this.update()
  }

  pixelToCaret (x, y) {
    x = Math.trunc(x / this.caretWidth)
    y = Math.trunc(y / this.caretHeight)
    return { x, y }
  }

  caretToPixel (x, y) {
    x *= this.caretWidth
    y *= this.caretHeight
    return { x, y }
  }

  onMouseDownCaret (e) {
    let info = app.mouseInfo(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let { x, y } = this.pixelToCaret(info.x, info.y)
        this.moveCaret(x, y)
      }
    }
  }

  onMouseMoveCaret (e) {
    let info = app.mouseInfo(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let { x, y } = this.pixelToCaret(info.x, info.y)
        this.moveCaret(x, y)
      }
    }
  }

}

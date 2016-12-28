
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
      caretToPos: { declared: true },
      posToCaret: { declared: true },
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
      obj.caretOffsetX = _.get(options, 'offsetX', 0)
      obj.caretOffsetY = _.get(options, 'offsetY', -1)
      obj.caretWrap = _.get(options, 'wrap', true)

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

  get caretOffsetX () { return this._caret._offsetX }
  set caretOffsetX (value) {
    this._caret._offsetX = value
  }

  get caretOffsetY () { return this._caret._offsetY }
  set caretOffsetY (value) {
    this._caret._offsetY = value
  }

  get caretWrap () { return this._caret._wrap }
  set caretWrap (value) {
    this._caret._wrap = value
  }

  get caretWidth () { return 0 }
  get caretHeight () { return 0 }

  caretMinX (y) { return 0 }
  caretMinY (x) { return 0 }
  caretMaxX (y) { return 0 }
  caretMaxY (x) { return 0 }

  caretToPos (x, y) { return 0 }
  posToCaret (pos) { return { x: 0, y: 0 } }

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

  get caretPos () { return this.caretToPos(this.caretX, this.caretY) }

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
    let minX = this.caretMinX(y)
    let maxX = this.caretMaxX(y)

    let minY = this.caretMinY(x)
    let maxY = this.caretMaxY(x)

    if (this.caretWrap) {
      if (x > maxX && y < maxY) {
        y++
        let omaxX = maxX
        minX = this.caretMinX(y)
        maxX = this.caretMaxX(y)
        x = minX + (x - omaxX - 1)
      }
      else if (x < minX && y > minY) {
        y--
        minX = this.caretMinX(y)
        maxX = this.caretMaxX(y)
        x = maxX + x + 1
      }
    }

    y = Math.max(minY, Math.min(maxY, y))
    x = Math.max(minX, Math.min(maxX, x))

    if (x !== this.caretX || y !== this.caretY) {
      this._caret._posY = y
      this._caret._posX = x

      this._caret.position.set(x * this.caretWidth + this.caretOffsetX, y * this.caretHeight + this.caretOffsetY)
      this._caret.visible = this._caret._show

      return this.update()
    }
    return this
  }

  moveCaretPos (pos) {
    let { x, y } = this.posToCaret(pos)
    return this.moveCaret(x, y)
  }

  moveCaretPosBy (b) {
    return this.moveCaretPos(this.caretPos + b)
  }

  moveCaretBy (bx, by) {
    return this.moveCaret(this.caretX + bx, this.caretY + by)
  }

  moveCaretLeft (bx = 1) {
    return this.moveCaret(this.caretX - bx, this.caretY)
  }

  moveCaretRight (bx = 1) {
    return this.moveCaret(this.caretX + bx, this.caretY)
  }

  moveCaretUp (by = 1) {
    return this.moveCaret(this.caretX, this.caretY - by)
  }

  moveCaretDown (by = 1) {
    return this.moveCaret(this.caretX, this.caretY + by)
  }

  moveCaretBol () {
    return this.moveCaret(this.caretMinX(this.caretY), this.caretY)
  }

  moveCaretEol () {
    return this.moveCaret(this.caretMaxX(this.caretY), this.caretY)
  }

  moveCaretNextLine () {
    return this.moveCaretBol().moveCaretDown()
  }

  onMouseDownCaret (e) {
    let info = app.mouseEvent(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let { x, y } = this.pixelToCaret(info.x, info.y)
        this.moveCaret(x, y)
      }
    }
  }

  onMouseMoveCaret (e) {
    let info = app.mouseEvent(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let { x, y } = this.pixelToCaret(info.x, info.y)
        this.moveCaret(x, y)
      }
    }
  }

}

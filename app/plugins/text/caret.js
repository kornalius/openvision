
export default class Caret extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'caret'
    this._desc = 'Creates a text caret.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/10/2017'
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
    if (super.load(obj, options)) {
      obj._caret = new app.Rectangle(obj.caretWidth, obj.caretHeight, _.get(options, 'color', 0xFFFFFF), _.get(options, 'alpha', 1))
      obj.addChild(obj._caret)

      obj._caret._interval = 0
      obj._caret._style = _.get(options, 'style', 'vline')

      obj.caretVisible = _.get(options, 'visible', true)
      obj.caretBlink = _.get(options, 'blink', 500)
      obj.caretWrap = _.get(options, 'wrap', true)

      obj.setCaretShape()

      obj._caret.visible = obj.canShowCaret

      obj.moveCaret(_.get(options, 'x', 0), _.get(options, 'y', 0))

      obj.on('mousedown', obj.onMouseDownCaret)
      obj.on('mousemove', obj.onMouseMoveCaret)

      obj.on('blur', obj.onBlur)
      obj.on('focus', obj.onFocus)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      clearInterval(obj._caret._interval)
      obj.removeChild(obj._caret)
      delete obj._caret
      if (_.isFunction(obj.update)) {
        obj.update()
      }
      obj.off('mousedown', obj.onMouseDownCaret)
      obj.off('mousemove', obj.onMouseMoveCaret)
    }
  }

  blinkCaret () {
    this._caret.visible = !this._caret.visible
    if (!this._caret._show) {
      this._caret.visible = false
    }
    this.update()
  }

  get caretWrap () { return this._caret._wrap }
  set caretWrap (value) {
    this._caret._wrap = value
  }

  get caretWidth () { return 0 }
  get caretHeight () { return 0 }

  get caretStyle () { return this._caret._style }
  set caretStyle (value) {
    if (_.includes(['vline', 'block', 'underline'])) {
      this._caret._style = value
      this.setCaretShape()
    }
  }

  setCaretShape () {
    this._caret.width = this.caretViewWidth
    this._caret.height = this.caretViewHeight
    this.update()
  }

  get caretViewLeft () {
    return _.includes(['vline', 'underline'], this.caretStyle) ? -1 : 0
  }

  get caretViewTop () {
    return this.caretStyle === 'underline' ? this.caretHeight - this.caretViewHeight : 0
  }

  get caretViewWidth () {
    return this.caretStyle === 'vline' ? 3 : this.caretWidth + (this.caretStyle === 'underline' ? 1 : 0)
  }

  get caretViewHeight () {
    return this.caretStyle === 'underline' ? 3 : this.caretHeight
  }

  caretMinX (y) { return 0 }
  caretMinY (x) { return 0 }
  caretMaxX (y) { return 0 }
  caretMaxY (x) { return 0 }

  caretToPos (x, y) { return 0 }
  posToCaret (pos) { return { x: 0, y: 0 } }

  pixelToCaret (x, y) {
    if (this.caretStyle === 'vline') {
      x = Math.ceil((x - this.caretWidth * 0.25) / this.caretWidth)
    }
    else {
      x = Math.trunc(x / this.caretWidth)
    }
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
    if (this.canShowCaret) {
      this.startCaretBlink()
    }
  }

  get canShowCaret () { return this._caret._show && this.focused }

  startCaretBlink () {
    this.stopCaretBlink()
    this._caret._interval = setInterval(this.blinkCaret.bind(this), this._caret._blink)
  }

  stopCaretBlink () {
    clearInterval(this._caret._interval)
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

      this._caret.position.set(x * this.caretWidth + this.caretViewLeft, y * this.caretHeight + this.caretViewTop)
      this._caret.visible = this.canShowCaret

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

  onFocus () {
    this._caret.visible = true
    this.startCaretBlink()
    this.update()
  }

  onBlur () {
    this._caret.visible = false
    this.stopCaretBlink()
    this.update()
  }
}

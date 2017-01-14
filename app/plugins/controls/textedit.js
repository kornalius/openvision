
export default class TextEdit extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'textedit'
    this._desc = 'Allow text to be editable.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/07/2017'
    this._deps = ['control', 'editable', 'text']
    this._requires = ['caret']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._multiline = true
      obj._oldTabIndex = obj.tabIndex
      obj.acceptTab = _.get(options, 'acceptTab', false)
      obj._onKeyDownTextEdit = obj.onKeyDownTextEdit.bind(obj)
      window.addEventListener('keydown', obj._onKeyDownTextEdit, false)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._multiline
      delete obj._oldTabIndex
      delete obj._acceptTab
      window.removeEventListener('keydown', obj._onKeyDownTextEdit, false)
      delete obj._onKeyDownTextEdit
    }
  }

  get acceptTab () { return this._acceptTab }
  set acceptTab (value) {
    this._acceptTab = value
    if (value) {
      this._oldTabIndex = this.tabIndex
      this.tabIndex = -1
    }
    else {
      this.tabIndex = this._oldTabIndex
    }
  }

  // get focusRectPadding () { return new PIXI.Rectangle(-2, -2, this.charWidth + 2, 2) }

  get multiline () { return this._multiline }
  set multiline (value) {
    this._multiline = value
  }

  caretToPos (x, y) {
    let i = this.lineInfo(y)
    return (i ? i.start : 0) + x
  }

  posToCaret (pos) {
    let x = 0
    let y = 0
    for (let yy = 0; yy < this.lineCount; yy++) {
      let i = this.lineInfo(yy)
      if (pos >= i.start && pos <= i.end) {
        x = pos - i.start
        break
      }
      y++
    }
    return { x, y }
  }

  get caretWidth () { return this.charWidth }

  get caretHeight () { return this.charHeight }

  caretMaxX (y) { return this.validLine(y) ? this.lineLength(y) : 0 }

  caretMaxY (x) { return this.lineCount - 1 }

  // TODO
  ensureCaretInView () {
    return this
  }

  moveByWord (dir, camelcase = false) {
    let w
    switch (dir) {
      case 'left':
        w = this.prevWord(this.caretPos, camelcase)
        return w ? this.moveCaretPos(w.start) : this
      case 'right':
        w = this.nextWord(this.caretPos, camelcase)
        return w ? this.moveCaretPos(w.start) : this
    }
    return this
  }

  moveCaretDir (dir, shiftKey, ctrlKey, altKey, metaKey) {
    if (shiftKey) {
    }
    else if (ctrlKey) {
      switch (dir) {
        case 'left':
          return this.moveByWord('left', true)
        case 'right':
          return this.moveByWord('right', true)
      }
    }
    else if (altKey) {
      switch (dir) {
        case 'left':
          return this.moveByWord('left')
        case 'right':
          return this.moveByWord('right')
      }
    }
    else if (metaKey) {
      switch (dir) {
        case 'left':
          return this.moveCaretBol()
        case 'right':
          return this.moveCaretEol()
      }
    }
    else {
      switch (dir) {
        case 'left':
          return this.moveCaretLeft()
        case 'right':
          return this.moveCaretRight()
        case 'up':
          return this.moveCaretUp()
        case 'down':
          return this.moveCaretDown()
      }
    }
    return this
  }

  onKeyDownTextEdit (e) {
    if (this.focused) {
      if (e.key === 'Tab' && this.acceptTab) {
        this.insertText('  ')
        this.moveCaretPosBy(2)
      }
      else if (e.key === 'Delete') {
        this.deleteTextDir('right', e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }
      else if (e.key === 'Backspace') {
        this.deleteTextDir('left', e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }
      else if (e.key.startsWith('Arrow')) {
        this.moveCaretDir(e.key.substr(5).toLowerCase(), e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }
      else if (e.key === 'Home' || e.key === 'End') {
        this.moveCaret(e.key === 'Home' ? 0 : this.caretMaxX(this.caretY), this.caretY)
      }
      else if (e.key.startsWith('Page')) {
      }
      else if (e.key === 'Enter' && this.multiline) {
        this.insertText(this.CR)
        this.moveCaretNextLine()
      }
      else if (e.key.length === 1) {
        this.insertText(e.key)
        this.moveCaretPosBy(1)
      }
      e.stopPropagation()
      e.preventDefault()
    }
  }

}

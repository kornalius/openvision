
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'textedit'
    this._desc = 'Allow text to be editable.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/16/2016'
    this._deps = ['editable', 'text']
    this._containers = ['Text']
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj._oldTabIndex = -1
    obj.acceptTab = _.get(options, 'acceptTab', false)
    obj._onKeyDownTextEdit = obj.onKeyDownTextEdit.bind(obj)
    window.addEventListener('keydown', obj._onKeyDownTextEdit, false)
  }

  unload (obj) {
    delete obj._oldTabIndex
    delete obj._acceptTab
    window.removeEventListener('keydown', obj._onKeyDownTextEdit, false)
    delete obj._onKeyDownTextEdit
    super.unload(obj)
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

  caretToPos (x, y) {
    return this.lineStart(y) + x
  }

  posToCaret (pos) {
    let x = 0
    let y = 0
    let lines = this.lines
    for (let yy = 0; yy < this.lineCount; yy++) {
      pos -= lines[yy].length
      if (pos >= 0) {
        y++
      }
      else {
        x = Math.abs(pos)
      }
    }
    return { x, y }
  }

  get caretWidth () { return this.charWidth }

  get caretHeight () { return this.charHeight }

  caretMaxX (y) { return this.validLine(y) ? this.lineLength(y) : 0 }

  caretMaxY (x) { return this.linesCount - 1 }

  moveByWord (count = 1) {
    let words = []
    return this
  }

  moveCaretDir (dir, shiftKey, ctrlKey, altKey, metaKey) {
    if (shiftKey) {
    }
    else if (ctrlKey) {
    }
    else if (altKey) {
    }
    else if (metaKey) {
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
        let count = this.deleteTextDir('left', e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
        this.moveCaretPosBy(-count)
      }
      else if (e.key.startsWith('Arrow')) {
        this.moveCaretDir(e.key.substr(5).toLowerCase(), e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }
      else if (e.key === 'Home' || e.key === 'End') {
        this.moveCaret(e.key === 'Home' ? 0 : this.caretMaxX(this.caretY), this.caretY)
      }
      else if (e.key.startsWith('Page')) {
      }
      else if (e.charCode === 13 || e.charCode > 31) {
        this.insertText(e.char)
        this.moveCaretPosBy(1)
      }
    }
  }

}

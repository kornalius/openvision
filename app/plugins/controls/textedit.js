
export default class TextEdit extends Plugin {

  constructor () {
    super()
    this.name = 'textedit'
    this.desc = 'Allow text to be editable.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control', 'focusable', 'hover', 'editable', 'textbuffer', 'caret']
    this.properties = {
      multiline: { value: true, options: 'multiline' },
      acceptTab: { value: false, options: 'acceptTab', set: this.setAcceptTab },
    }
    this.overrides = {
      caret: {
        width: { get: function width () { return this.owner.charWidth } },
        height: { get: function height () { return this.owner.charHeight } },
        maxX: function maxX (y) { return this.text.validLine(y) ? this.text.lineLength(y) : 0 },
        maxY: function maxY (x) { return this.text.lineCount - 1 },
      },
    }
  }

  init (owner, options = {}) {
    this._oldTabIndex = owner.focusable.index

    this._oldDefaultCursor = owner.defaultCursor
    owner.defaultCursor = 'text'

    this._onKeydown = this.onKeydown.bind(this)
    window.addEventListener('keydown', this._onKeydown, false)

    this.owner.caret.reshape()
  }

  destroy (owner) {
    window.removeEventListener('keydown', this._onKeydown, false)
    owner.defaultCursor = this._oldDefaultCursor
  }

  get text () { return this.owner.textbuffer }

  get caret () { return this.owner.caret }

  get focusable () { return this.owner.focusable }

  setAcceptTab (value) {
    this._acceptTab = value
    if (value) {
      this._oldTabIndex = this.focusable.index
      this.focusable.index = -1
    }
    else {
      this.focusable.index = this._oldTabIndex
    }
  }

  // TODO
  ensureCaretInView () {
    return this.owner
  }

  moveByWord (dir, camelcase = false) {
    let w
    switch (dir) {
      case 'left':
        w = this.text.prevWord(this.caretPos, camelcase)
        return w ? this.setCaretPos(w.start) : this.owner
      case 'right':
        w = this.text.nextWord(this.caretPos, camelcase)
        return w ? this.setCaretPos(w.start) : this.owner
    }
    return this.owner
  }

  moveDir (dir, shiftKey, ctrlKey, altKey, metaKey) {
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
          return this.caret.bol()
        case 'right':
          return this.caret.eol()
      }
    }
    else {
      switch (dir) {
        case 'left':
          return this.caret.left()
        case 'right':
          return this.caret.right()
        case 'up':
          return this.caret.up()
        case 'down':
          return this.caret.down()
      }
    }
    return this.owner
  }

  onKeydown (e) {
    if (this.focusable.focused && !this.readonly) {
      if (e.key === 'Tab' && this._acceptTab) {
        this.text.insert('  ')
        this.caret.by(2, 0)
      }
      else if (e.key === 'Delete') {
        this.text.deleteDir('right', e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }
      else if (e.key === 'Backspace') {
        this.text.deleteDir('left', e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }
      else if (e.key.startsWith('Arrow')) {
        this.moveDir(e.key.substr(5).toLowerCase(), e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }
      else if (e.key === 'Home' || e.key === 'End') {
        this.caret.set(e.key === 'Home' ? 0 : this.maxX(this._caret.y), this._caret.y)
      }
      else if (e.key.startsWith('Page')) {
      }
      else if (e.key === 'Enter' && this._multiline) {
        this.text.insert(this.CR)
        this.caret.nextLine()
      }
      else if (e.key.length === 1) {
        this.text.insert(e.key)
        this.caret.by(1, 0)
      }
      e.stopPropagation()
      e.preventDefault()
    }
  }

}

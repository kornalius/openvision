
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
        width: { get: function width () { return this.$.charWidth } },
        height: { get: function height () { return this.$.charHeight } },
        maxX: function maxX (y) { return this.$.__textbuffer.validLine(y) ? this.$.__textbuffer.lineLength(y) : 0 },
        maxY: function maxY (x) { return this.$.__textbuffer.lineCount - 1 },
      },
    }
  }

  init ($, options = {}) {
    this._oldTabIndex = $.__focusable.index

    this._oldDefaultCursor = $.defaultCursor
    $.defaultCursor = 'text'

    this._onKeydown = this.onKeydown.bind(this)
    window.addEventListener('keydown', this._onKeydown, false)

    this.$.__caret.reshape()
  }

  destroy ($) {
    window.removeEventListener('keydown', this._onKeydown, false)
    $.defaultCursor = this._oldDefaultCursor
  }

  setAcceptTab (value) {
    this._acceptTab = value
    if (value) {
      this._oldTabIndex = this.$.__focusable.index
      this.$.__focusable.index = -1
    }
    else {
      this.$.__focusable.index = this._oldTabIndex
    }
  }

  // TODO
  ensureCaretInView () {
    return this
  }

  moveByWord (dir, camelcase = false) {
    let w
    switch (dir) {
      case 'left':
        w = this.$.__textbuffer.prevWord(this.caretPos, camelcase)
        return w ? this.setCaretPos(w.start) : this.$
      case 'right':
        w = this.$.__textbuffer.nextWord(this.caretPos, camelcase)
        return w ? this.setCaretPos(w.start) : this.$
    }
    return this
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
          return this.$.__caret.bol()
        case 'right':
          return this.$.__caret.eol()
      }
    }
    else {
      switch (dir) {
        case 'left':
          return this.$.__caret.left()
        case 'right':
          return this.$.__caret.right()
        case 'up':
          return this.$.__caret.up()
        case 'down':
          return this.$.__caret.down()
      }
    }
    return this
  }

  onKeydown (e) {
    if (this.$.__focusable.focused && !this.readonly) {
      if (e.key === 'Tab') {
        if (this._acceptTab) {
          this.$.__textbuffer.insert('  ')
          this.$.__caret.by(2, 0)
        }
        else {
          return
        }
      }

      else if (e.key === 'Delete') {
        this.$.__textbuffer.deleteDir('right', e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }

      else if (e.key === 'Backspace') {
        this.$.__textbuffer.deleteDir('left', e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }

      else if (e.key.startsWith('Arrow')) {
        this.moveDir(e.key.substr(5).toLowerCase(), e.shiftKey, e.ctrlKey, e.altKey, e.metaKey)
      }

      else if (e.key === 'Home' || e.key === 'End') {
        this.$.__caret.set(e.key === 'Home' ? 0 : this.maxX(this.$.__caret.y), this.$.__caret.y)
      }

      else if (e.key.startsWith('Page')) {
      }

      else if (e.key === 'Enter' && this._multiline) {
        this.$.__textbuffer.insert(this.$.__textbuffer.CR)
        this.$.__caret.nextLine()
      }

      else if (e.key.length === 1) {
        this.$.__textbuffer.insert(e.key)
        this.$.__caret.by(1, 0)
      }

      e.stopPropagation()
      e.preventDefault()
    }
  }

}

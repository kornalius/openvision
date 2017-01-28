let { Patch, INSERT, DELETE } = app


const CR = '\n'
const TAB = '\t'
const SPACE = ' '

const NONWORDCHARS = [SPACE, CR, TAB, '!', '?', '#', '@', '$', '%', '^', '&', '|', '(', ')', '{', '}', '[', ']', '\'', '"', '.', ',', ':', ';', '<', '>', '\\', '*', '/', '=', '+', '-']

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')


class TextPatch extends Patch {

  apply (obj) {
    switch (this.action) {
      case INSERT:
        this.insertAt(this.start, this.value)
        break
      case DELETE:
        this.deleteAt(this.start, this.length)
        break
    }
    return this
  }

}


export default class TextBuffer extends Plugin {

  constructor () {
    super()
    this.name = 'textbuffer'
    this.desc = 'Add text manipulation functions to text container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      value: { value: '', set: this.set },
      wordwrap: { value: false, options: 'wordwrap', set: this.setWordwrap },
      wrapwidth: { value: 0, options: 'wrapwidth', set: this.setWrapwidth },
      wordbreak: { value: false, options: 'wordbreak', set: this.setWordbreak },
    }
  }

  attach ($, options = {}) {
    this.value = $.text || this._value
  }

  get CR () { return CR }
  get TAB () { return TAB }
  get SPACE () { return SPACE }

  set (value) {
    this._value = value
    this.$.text = value
    this.refresh()
    return this.lines // to update text on Text container
  }

  get length () { return this._value.length }

  refresh () {
    this._lines = null
    this._linesInfo = null
  }

  setWordwrap (value) {
    this._wordwrap = value
    this.refresh()
  }

  setWrapwidth (value) {
    this._wrapwidth = value
    this.refresh()
  }

  setWordbreak (value) {
    this._wordbreak = value
    this.refresh()
  }

  get caretPos () {
    let c = this.$.__caret
    let i = this.lineInfo(c.y)
    return (i ? i.start : 0) + c.x
  }

  set caretPos (value) {
    let x = 0
    let y = 0
    let lc = this.lineCount
    for (let yy = 0; yy < lc; yy++) {
      let i = this.lineInfo(yy)
      if (value >= i.start && value <= i.end) {
        x = value - i.start
        break
      }
      y++
    }
    this.$.__caret.set(x, y)
  }

  clipPos (pos) { return Math.max(0, Math.min(pos, this.length - 1)) }

  validPos (pos) { return pos >= 0 && pos < this.length }

  validLine (y) { return y >= 0 && y < this.lineCount }

  get lineCount () { return this.lines.length }

  lineLength (y) { return this.lineAt(y).length }

  lineAt (y) {
    return y >= 0 && y < this.lineCount ? this.lines[y] : null
  }

  charAt (pos) {
    return this.validPos(pos) ? this.value[pos] : null
  }

  get lines () {
    if (!this._lines) {
      let text = this._wordwrap ? this.wrapLines(this._value, { wrapwidth: this._wrapwidth, wordbreak: this._wordbreak }) : this._value
      this._lines = text.split(/(?:\r\n|\r|\n)/)
      this._linesInfo = null
      this._value = text
      this.$.text = text
    }
    return this._lines
  }

  get linesInfo () {
    if (this._lines && !this._linesInfo) {
      let crlen = CR.length
      let start = 0
      let end = 0
      let y = 0

      this._linesInfo = new Array(this.lineCount)

      for (let l of this._lines) {
        start = end
        end += l.length + crlen
        this._linesInfo[y++] = { start, end, text: l, length: end - start }
      }
    }
    return this._linesInfo
  }

  lineInfo (y) { return this.validLine(y) && this.linesInfo[y] }

  insertAt (pos, s) {
    this.value = this.value.splice(pos, 0, s)
    this.$.update()
    return this
  }

  insert (s = '') {
    return this.insertAt(this.caretPos, s)
  }

  setLineAt (y, s = '') {
    let i = this.lineInfo(y)
    if (i) {
      this.value = this.value.splice(i.start, i.length - 1, s)
      this.$.update()
    }
    return this
  }

  insertLineAt (y, s = '') {
    let i = this.lineInfo(y)
    if (i) {
      this.insertAt(i.start, s + CR)
    }
    return this
  }

  newLine (s = '') {
    this.value += s + CR
    this.$.update()
    return this
  }

  deleteAt (pos, count = 1) {
    this.value = this.value.splice(pos, count)
    this.$.update()
    return this
  }

  delete (count = 1) {
    return this.deleteAt(this.caretPos, count)
  }

  deleteWordAt (pos, camelcase = false, count = 1) {
    let word = this.wordAt(pos, camelcase)
    while (word && count) {
      this.deleteAt(word.start, word.length)
      word = this.wordAt(pos)
      count--
    }
    return this
  }

  deleteDir (dir, shiftKey, ctrlKey, altKey, metaKey) {
    if (ctrlKey) {
    }
    else if (altKey) {
    }
    else if (metaKey) {
    }
    else {
      switch (dir) {
        case 'left':
          this.$.__caret.left()
          this.delete()
          break
        case 'right':
          this.delete()
          break
      }
    }
    return this
  }

  deleteLineAt (y) {
    let i = this.lineInfo(y)
    if (i) {
      this.value = this.value.splice(i.start, i.length)
    }
    return i.text
  }

  deleteLines (y, y2) {
    for (let i = y; i <= y2; i++) {
      this.deleteLineAt(i)
    }
    return this
  }

  shiftLinesUp (y, y2) {
    if (this.validLine(y) && this.validLine(y2)) {
      let prevLine = this.deleteLineAt(y - 1)
      this.insertLineAt(y2, prevLine)
    }
    return this
  }

  shiftLinesDown (y, y2) {
    if (this.validLine(y) && this.validLine(y2 - 1)) {
      let nextLine = this.deleteLineAt(y2 + 1)
      this.insertLineAt(y, nextLine)
    }
    return this
  }

  isWordCharAt (pos) { return this.isWordChar(this.charAt(pos)) }

  isWordChar (c) {
    return !_.includes(NONWORDCHARS, c)
  }

  isUpper (c) {
    return _.includes(UPPER, c)
  }

  range (start, end) {
    start = this.clipPos(start)
    end = this.clipPos(end)
    return end >= start ? { text: this.value.substring(start, end + 1), start, end, length: end - start + 1 } : null
  }

  prevNonWordChar (pos, camelcase = false) {
    let t = this.value
    for (let i = pos; i >= 0; i--) {
      let up = camelcase && this.isUpper(t[i])
      if (!this.isWordChar(t[i]) || up) {
        return up ? i - 1 : i
      }
    }
    return -1
  }

  prevWordChar (pos, camelcase = false) {
    let t = this.value
    for (let i = pos; i >= 0; i--) {
      if (this.isWordChar(t[i])) {
        return i
      }
    }
    return -1
  }

  nextNonWordChar (pos, camelcase = false) {
    let t = this.value
    let len = this.length
    for (let i = pos; i < len; i++) {
      let up = camelcase && this.isUpper(t[i])
      if (!this.isWordChar(t[i]) || up) {
        return up ? i + 1 : i
      }
    }
    return -1
  }

  nextWordChar (pos, camelcase = false) {
    let t = this.value
    let len = this.length
    for (let i = pos; i < len; i++) {
      if (this.isWordChar(t[i])) {
        return i
      }
    }
    return -1
  }

  prevWord (pos, camelcase = false) {
    let end
    if (!this.isWordCharAt(pos)) {
      end = this.prevWordChar(pos, camelcase)
    }
    else {
      end = this.prevNonWordChar(pos, camelcase) - 1
    }
    let start = this.prevNonWordChar(end, camelcase) + 1
    return this.range(start, end < 0 ? this.length : end)
  }

  nextWord (pos, camelcase = false) {
    let start
    if (!this.isWordCharAt(pos)) {
      start = this.nextWordChar(pos, camelcase)
    }
    else {
      start = this.nextNonWordChar(pos, camelcase) + 1
    }
    let end = this.nextNonWordChar(start, camelcase) - 1
    return this.range(start, end < 0 ? this.length : end)
  }

  wordAt (pos, camelcase = false) {
    if (this.isWordCharAt(pos)) {
      let start = this.prevNonWordChar(pos, camelcase) + 1
      let end = this.nextNonWordChar(pos, camelcase) - 1
      return this.range(start, end < 0 ? this.length : end)
    }
    return null
  }

  wrapLines (text, options) {
    let result = ''
    let width = options.wrapwidth
    let _break = options.wordbreak
    let lines = text.split(CR)
    let count = lines.length

    for (let i = 0; i < count; i++) {
      let l = width
      let firstWord = true

      for (let word of lines[i].split(' ')) {
        let wl = word.length

        if (_break && wl > width) {
          let firstChar = true
          for (let c of word.split('')) {
            if (l > 1) {
              result += CR + c
              l = width - 1
            }
            else {
              result += (firstChar ? ' ' : '') + c
              l--
            }
            firstChar = false
          }
        }
        else {
          let wsl = wl + 1
          if (firstWord || wsl > l) {
            result += (!firstWord ? CR : '') + word
            l = width - wl
          }
          else {
            result += ' ' + word
            l -= wsl
          }
        }

        firstWord = false
      }

      if (i < count - 1) {
        result += CR
      }
    }

    return result
  }

  get firstLine () { return this.lineAt(0) }

  get lastLine () { return this.lineAt(this.lineCount - 1) }

  isBlankLine (y) { return /\S/.test(this.lineAt(y)) }

  prevNonBlankLine (start) {
    if (start > 0) {
      start = Math.min(start, this.lineCount - 1)
      for (let y = start - 1; y > 0; y--) {
        if (!this.isBlankLine(y)) {
          return y
        }
      }
    }
    return null
  }

  nextNonBlankLine (start) {
    let count = this.lineCount
    if (start < count - 1) {
      start = Math.min(start, count - 1)
      for (let y = start + 1; y < count; y++) {
        if (!this.isBlankLine(y)) {
          return y
        }
      }
    }
    return null
  }

}

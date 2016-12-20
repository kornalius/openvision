const CR = '\n'
const TAB = '\t'
const SPACE = ' '

const PUNCTUATION = [SPACE, CR, TAB, '!', '?', '#', '@', '$', '%', '^', '&', '|', '(', ')', '{', '}', '[', ']', '\'', '"', '.', ',', ':', ';', '_', '<', '>', '\\', '*', '/', '=', '+', '-']

const UPPER = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ']


export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'text'
    this._desc = 'Add text manipulation functions to text container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/19/2016'
    this._containers = ['Text']
  }

  load (obj, options = {}) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
  }

  validLine (y) { return y >= 0 && y < this.lineCount }

  get lineCount () { return this.lines.length }

  lineLength (y) { return this.lineAt(y).length }

  lineAt (y) {
    return y >= 0 && y < this.lineCount ? this.lines[y] : null
  }

  charAt (x, y) {
    let l = this.lineAt(y)
    return l && x >= 0 && x < l.length ? l[x] : null
  }

  lineAtPos (pos) {
    let { y } = this.posToCaret(pos)
    return this.lineAt(y)
  }

  charAtPos (pos) {
    let { x, y } = this.posToCaret(pos)
    return this.charAt(x, y)
  }

  lineInfo (y) {
    let i = null
    if (this.validLine(y)) {
      let crlen = CR.length
      let start = 0
      let end = 0
      let yy = 0
      let lines = this.lines

      while (yy <= y) {
        start = end
        end += lines[yy].length + crlen
        yy++
      }

      i = {
        start,
        end,
        text: this.lineAt(y),
        length: end - start,
      }
    }
    return i
  }

  insertTextAtPos (pos, s) {
    this.text.splice(pos, 0, s)
    return this.update()
  }

  insertTextAt (x, y, s) {
    return this.insertTextAtPos(this.caretToPos(x, y), s)
  }

  insertText (s = '') {
    return this.insertTextAtPos(this.caretPos, s)
  }

  setLineAt (y, s = '') {
    let i = this.lineInfo(y)
    if (i) {
      this.text.splice(i.start, i.length - 1, s)
      this.update()
    }
    return this
  }

  insertLineAt (y, s = '') {
    let i = this.lineInfo(y)
    if (i) {
      this.insertTextAtPos(i.start, s + CR)
    }
    return this
  }

  insertLineAtPos (pos, s = '') {
    return this.insertLineAt(this.posToCaret(pos).y, s)
  }

  newLine (s = '') {
    this.text += s + CR
    return this.update()
  }

  deleteTextAtPos (pos, count = 1) {
    this.text.splice(pos, count)
    return this.update()
  }

  deleteTextAt (x, y, count = 1) {
    return this.deleteTextAtPos(this.caretToPos(x, y), count)
  }

  deleteText (count = 1) {
    return this.deleteTextAtPos(this.caretPos, count)
  }

  deleteWordAtPos (pos, count = 1) {
    let word = this.wordAtPos(pos)
    while (word && count) {
      this.deleteTextAtPos(word.start, word.length)
      word = this.wordAtPos(pos)
      count--
    }
    return this
  }

  deleteTextDir (dir, shiftKey, ctrlKey, altKey, metaKey) {
    if (ctrlKey) {
    }
    else if (altKey) {
    }
    else if (metaKey) {
    }
    else {
      switch (dir) {
        case 'left':
          this.deleteText()
          return 1
        case 'right':
          this.deleteText()
          return 0
      }
    }
    return 0
  }

  deleteLineAt (y) {
    let i = this.lineInfo(y)
    if (i) {
      this.text.splice(i.start, i.length)
    }
    return i.text
  }

  deleteLineAtPos (pos) {
    return this.deleteLineAt(this.posToCaret(pos).y)
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

  wordsAtPos (pos, uppercase = false, stop = '\n') {
    var words = []
    let word = ''
    let t = this.text

    for (let i = pos; i < t.length; i++) {
      let c = t[i]
      if (_.includes(PUNCTUATION, c)) {
        words.push({ text: word, start: i - word.length, end: i, length: word.length })
        if (!_.includes([SPACE, CR], c)) {
          words.push({ text: c, start: i, end: i, length: 1 })
          words.push(c)
        }
        word = ''
        if (c === stop || uppercase && _.includes(UPPER, c)) {
          break
        }
      }
      else {
        word += c
      }
    }

    return words
  }

  wordsAt (x, y, uppercase = false, stop = '\n') {
    return this.wordsAtPos(this.caretToPos(x, y), uppercase, stop)
  }

  wordAtPos (pos, uppercase = false) {
    let t = this.text
    let start = -1
    let end = -1

    let i = pos
    while (i > 0) {
      let c = t[i]
      if (_.includes(PUNCTUATION, c) || uppercase && _.includes(UPPER, c)) {
        start = i
        break
      }
      i--
    }

    i = pos
    while (i < t.length) {
      let c = t[i]
      if (_.includes(PUNCTUATION, c) || uppercase && _.includes(UPPER, c)) {
        end = i
        break
      }
      i++
    }

    return start !== -1 && end !== -1 ? { text: t.substring(start, end), start, end, length: end - start } : null
  }

  wordAt (x, y, uppercase = false) {
    return this.wordAtPos(this.caretToPos(x, y, uppercase))
  }

}

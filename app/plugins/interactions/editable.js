
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'editable'
    this._desc = 'Allow text to be edited.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/16/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
  }

  get cursorWidth () { return this.charWidth }

  get cursorHeight () { return this.charHeight }

  get cursorMaxX () { return this.lines[this.cursorY].length }

  get cursorMaxY () { return this.lines.length - 1 }

}

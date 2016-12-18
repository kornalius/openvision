
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'textedit'
    this._desc = 'Allow text to be editable.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/16/2016'
    this._deps = ['editable']
  }

  load (obj, options = {}) {
    super.load(obj, options)
    if (!(obj instanceof app.Text)) {
      console.error('Must be a Text container')
    }
    obj._oldTabIndex = -1
    obj.acceptTab = _.get(options, 'acceptTab', false)
  }

  unload (obj) {
    delete obj._oldTabIndex
    delete obj._acceptTab
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

  get caretWidth () { return this.charWidth }

  get caretHeight () { return this.charHeight }

  get caretMaxX () { return this.lines[this.caretY].length }

  get caretMaxY () { return this.lines.length - 1 }

}

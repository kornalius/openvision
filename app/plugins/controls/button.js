
export default class Control extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'button'
    this._desc = 'Allow a container to act as a button.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/18/2017'
    this._deps = ['control', 'shape', 'font']
  }

  canLoad (obj) { return super.canLoad(obj) && !(obj instanceof app.Shape) }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      let t = obj._buttonText = new app.Text(_.get(options, 'text', 'BUTTON'), this.fontObject)
      t.plug('align').center()
      this.addChild(t)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      obj.removeChild(obj._buttonText)
      delete obj._buttonText
    }
  }

  get text () { return this._button.title.text }
  set text (value) {
    this._buttonText.text = value
    this._buttonText.update()
  }

}

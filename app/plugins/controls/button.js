
export default class Button extends Plugin {

  constructor () {
    super()
    this.name = 'button'
    this.desc = 'Allow a container to act as a button.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control']
    this.properties = {
      text: { value: 'BUTTON', set: this.setText },
    }
  }

  attach ($, options = {}) {
    let t = this._labelText = new app.Text(this._text, this._font)
    $.plug('layout').__layout.alignToParent()
    $.addChild(t)
  }

  detach ($) {
    $.removeChild(this._labelText)
  }

  setText (value) {
    this._text = value
    this._labelText.update()
  }

  get content () { return this._text }
  set content (value) {
    if (this._text !== value) {
      this.setText(value)
    }
  }

}

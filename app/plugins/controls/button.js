
export default class Button extends Plugin {

  constructor () {
    super()
    this.name = 'button'
    this.desc = 'Allow a container to act as a button.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['control']
    this.properties = {
      text: { value: 'BUTTON', options: 'text', set: this.setText },
    }
  }

  init (owner, options = {}) {
    let t = this._displayObject = new app.Text(this._text, this._font)
    t.plug('align').center()
    owner.addChild(t)
  }

  destroy (owner) {
    owner.removeChild(this._displayObject)
  }

  setText (value) {
    this._text = value
    this._displayObject.update()
  }

}

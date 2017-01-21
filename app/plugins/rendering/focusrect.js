
export default class FocusRect extends Plugin {

  constructor () {
    super()
    this.name = 'focusrect'
    this.desc = 'Draw an outline around a focused container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.dependencies = ['focusable']
    this.listeners = {
      $updatetransform: this.onUpdateTransform,
    }
  }

  init (owner, options = {}) {
    let r = this.padding
    let fr = this._rect = new app.Rectangle(owner.width + r.width, owner.height + r.height)
    fr.fill = false
    fr.borderSize = _.get(options, 'size', 1)
    fr.borderColor = _.get(options, 'color', 0xFFFFFF)
    fr.borderAlpha = _.get(options, 'alpha', 0.25)
    fr.visible = false
    owner.addChild(fr)

    if (owner.focusable.focused) {
      owner.focusrect.show()
    }
  }

  destroy (owner) {
    owner.removeChild(this._rect)
    owner.update()
  }

  get padding () { return new PIXI.Rectangle(-2, -2, 2, 2) }

  show () {
    let fr = this._rect
    let r = this.padding
    fr.x = r.x
    fr.y = r.y
    fr.width = this.width + r.width
    fr.height = this.height + r.height
    fr.visible = true
    fr.update()
  }

  hide () {
    let fr = this._rect
    fr.visible = false
    fr.update()
  }

  isVisible () { return this._rect.visible }

  onUpdateTransform () {
    let owner = this.owner
    let fr = this._rect
    let r = this.padding
    if (fr.visible && (fr.x !== r.x || fr.y !== r.y || fr.width !== owner.width + r.width || fr.height !== owner.height + r.height)) {
      fr.x = r.x
      fr.y = r.y
      fr.width = owner.width + r.width
      fr.height = owner.height + r.height
      fr.update()
    }
  }

}

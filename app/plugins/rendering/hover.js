
export default class Hover extends Plugin {

  constructor () {
    super()
    this.name = 'hover'
    this.desc = 'Draw something on container on mouse hover.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.listeners = {
      $mouseover: this.show,
      $mouseout: this.hide,
      $updatetransform: this.onUpdateTransform,
    }
  }

  init (owner, options = {}) {
    let r = this.padding
    let hr = this._rect = new app.Rectangle(owner.width + r.width, owner.height + r.height)
    hr.fill = false
    hr._alpha = _.get(options, 'alpha', 0.85)
    hr.borderSize = _.get(options, 'borderSize', 0.5)
    hr.borderColor = _.get(options, 'borderColor', 0xFFFFFF)
    hr.borderAlpha = _.get(options, 'borderAlpha', 0.15)
    // owner._hover.padding = _.get(options, 'padding', new PIXI.Rectangle(-2, -2, 2, 2))
    hr.visible = false

    owner.addChild(hr)

    owner.alpha = hr._alpha
  }

  get padding () { return new PIXI.Rectangle(-2, -2, 2, 2) }

  show () {
    let r = this.padding
    let hr = this._rect
    this.alpha = 1
    hr.x = r.x
    hr.y = r.y
    hr.width = this.width + r.width
    hr.height = this.height + r.height
    hr.visible = true
    hr.update()
    return this.owner
  }

  hide () {
    let hr = this._rect
    this.alpha = hr._alpha
    hr.visible = false
    hr.update()
    return this.owner
  }

  isVisible () { return this._rect.visible }

  onUpdateTransform () {
    let r = this.padding
    let hr = this._rect
    let owner = this.owner
    if (hr.visible && (hr.x !== r.x || hr.y !== r.y || hr.width !== owner.width + r.width || hr.height !== owner.height + r.height)) {
      hr.x = r.x
      hr.y = r.y
      hr.width = owner.width + r.width
      hr.height = owner.height + r.height
      hr.update()
    }
  }

}


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

  init ($, options = {}) {
    let r = this.padding
    let hr = this._rect = new app.Rectangle($.width + r.width, $.height + r.height)
    hr.fill = false
    hr._alpha = _.get(options, 'alpha', 0.85)
    hr.borderSize = _.get(options, 'borderSize', 0.5)
    hr.borderColor = _.get(options, 'borderColor', 0xFFFFFF)
    hr.borderAlpha = _.get(options, 'borderAlpha', 0.15)
    // $._hover.padding = _.get(options, 'padding', new PIXI.Rectangle(-2, -2, 2, 2))
    hr.visible = false

    $.addChild(hr)

    $.alpha = hr._alpha
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
    return this
  }

  hide () {
    let hr = this._rect
    this.alpha = hr._alpha
    hr.visible = false
    hr.update()
    return this
  }

  isVisible () { return this._rect.visible }

  onUpdateTransform () {
    let r = this.padding
    let hr = this._rect
    let $ = this.$
    if (hr.visible && (hr.x !== r.x || hr.y !== r.y || hr.width !== $.width + r.width || hr.height !== $.height + r.height)) {
      hr.x = r.x
      hr.y = r.y
      hr.width = $.width + r.width
      hr.height = $.height + r.height
      hr.update()
    }
  }

}

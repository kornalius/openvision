
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

  attach ($, options = {}) {
    let r = this.padding
    let fr = this._rect = new app.Rectangle($.width + r.width, $.height + r.height)
    fr.fill = false
    fr.borderSize = _.get(options, 'size', 1)
    fr.borderColor = _.get(options, 'color', 0xFFFFFF)
    fr.borderAlpha = _.get(options, 'alpha', 0.25)
    fr.visible = false
    $.addChild(fr)

    this.onUpdateTransform()

    if (this.$.__focusable.focused) {
      this.show()
    }
  }

  detach ($) {
    $.removeChild(this._rect)
    $.update()
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

  visible () { return this._rect.visible }

  onUpdateTransform () {
    let $ = this.$
    let fr = this._rect
    let r = this.padding
    if (fr.x !== r.x || fr.y !== r.y || fr.width !== $.width + r.width || fr.height !== $.height + r.height) {
      fr.x = r.x
      fr.y = r.y
      fr.width = $.width + r.width
      fr.height = $.height + r.height
      fr.update()
      let m = $.mask
      if (m) {
        m.x = fr.x
        m.y = fr.y
        m.width = fr.width
        m.height = fr.height
      }
    }
  }

}

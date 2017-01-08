
export default class FocusRect extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'focusrect'
    this._desc = 'Draw an outline around focused container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/08/2017'
    this._deps = ['focusable']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      let r = obj.focusRectPadding
      obj._focusrect = new app.Rectangle(obj.width + r.width, obj.height + r.height)
      obj._focusrect.fill = false
      obj._focusrect.borderSize = _.get(options, 'size', 1)
      obj._focusrect.borderColor = _.get(options, 'color', 0xFFFFFF)
      obj._focusrect.borderAlpha = _.get(options, 'alpha', 1)
      obj._focusrect.visible = false
      obj.addChild(obj._focusrect)
      if (obj.focused) {
        this.showFocusRect()
      }
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      obj.removeChild(obj._focusrect)
      delete obj._focusrect
      obj.update()
    }
  }

  get focusRectPadding () { return new PIXI.Rectangle(-2, -2, 2, 2) }

  showFocusRect () {
    let r = this.focusRectPadding
    this._focusrect.x = r.x
    this._focusrect.y = r.y
    this._focusrect.width = this.width + r.width
    this._focusrect.height = this.height + r.height
    this._focusrect.visible = true
    this._focusrect.update()
    this.update()
  }

  hideFocusRect () {
    this._focusrect.visible = false
    this._focusrect.update()
    this.update()
  }

  isFocusRectVisible () { return this._focusrect.visible }
}

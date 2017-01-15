
export default class Hover extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'hover'
    this._desc = 'Draw something on container on mouse hover.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/10/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      let r = obj.hoverPadding
      obj._hover = new app.Rectangle(obj.width + r.width, obj.height + r.height)
      obj._hover.fill = false
      obj._hover._alpha = _.get(options, 'alpha', 0.85)
      obj._hover.borderSize = _.get(options, 'borderSize', 0.5)
      obj._hover.borderColor = _.get(options, 'borderColor', 0xFFFFFF)
      obj._hover.borderAlpha = _.get(options, 'borderAlpha', 0.15)
      // obj._hover.padding = _.get(options, 'padding', new PIXI.Rectangle(-2, -2, 2, 2))
      obj._hover.visible = false

      obj.on('mouseover', obj.showHover)
      obj.on('mouseout', obj.hideHover)
      obj.on('updatetransform', obj._onUpdateHoverTransform)

      obj.alpha = obj._hover._alpha

      obj.addChild(obj._hover)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      obj.off('mouseover', obj.showHover)
      obj.off('mouseout', obj.hideHover)
      obj.off('updatetransform', obj._onUpdateHoverTransform)
      obj.removeChild(obj._hover)
      delete obj._hover
      obj.update()
    }
  }

  get hoverPadding () { return new PIXI.Rectangle(-2, -2, 2, 2) }

  showHover () {
    let r = this.hoverPadding
    this.alpha = 1
    this._hover.x = r.x
    this._hover.y = r.y
    this._hover.width = this.width + r.width
    this._hover.height = this.height + r.height
    this._hover.visible = true
    this._hover.update()
  }

  hideHover () {
    this.alpha = this._hover._alpha
    this._hover.visible = false
    this._hover.update()
  }

  isHoverVisible () { return this._hover.visible }

  _onUpdateHoverTransform () {
    let r = this.hoverPadding
    if (this._hover.visible && (this._hover.x !== r.x || this._hover.y !== r.y || this._hover.width !== this.width + r.width || this._hover.height !== this.height + r.height)) {
      this._hover.x = r.x
      this._hover.y = r.y
      this._hover.width = this.width + r.width
      this._hover.height = this.height + r.height
      this._hover.update()
    }
  }

}

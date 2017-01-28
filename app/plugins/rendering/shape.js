
export default class Shape extends Plugin {

  constructor () {
    super()
    this.name = 'shape'
    this.desc = 'Add shape drawing abilities to container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.listeners = {
      $updatetransform: this.onUpdateTransform,
    }
  }

  attach ($, options = {}) {
    let c = this._shape = new app.Shape($.width, $.height)
    c.fill = _.get(options, 'fill', true)
    c.color = _.get(options, 'color', 0xFFFFFF)
    c.alpha = _.get(options, 'alpha', 1)
    c.borderSize = _.get(options, 'border.size', 1)
    c.borderColor = _.get(options, 'border.color', 0)
    c.borderAlpha = _.get(options, 'border.alpha', 1)
    c.radius = _.get(options, 'radius', 0)
    c.style = _.get(options, 'style', 'rect')
    $.addChild(c)
  }

  detach ($) {
    $.removeChild(this._shape)
    $.update()
  }

  get fill () { return this._shape.fill }
  set fill (value) {
    this._shape.fill = value
    this._drawShape()
  }

  get color () { return this._shape.color }
  set color (value) {
    this._shape.color = value
    this._drawShape()
  }

  get alpha () { return this._shape.alpha }
  set alpha (value) {
    this._shape.alpha = value
    this._drawShape()
  }

  get borderSize () { return this._shape.borderSize }
  set borderSize (value) {
    this._shape.borderSize = value
    this._drawShape()
  }

  get borderColor () { return this._shape.borderColor }
  set borderColor (value) {
    this._shape.borderColor = value
    this._drawShape()
  }

  get borderAlpha () { return this._shape.borderAlpha }
  set borderAlpha (value) {
    this._shape.borderAlpha = value
    this._drawShape()
  }

  get radius () { return this._shape.radius }
  set radius (value) {
    this._shape.radius = value
    this._drawShape()
  }

  get style () { return this._shape.style }
  set style (value) {
    this._shape.style = value
    this._drawShape()
  }

  draw () {
    let c = this._shape
    if (this.style === 'rect') {
      if (this.radius) {
        c.drawRoundedRect(0, 0, this.width - 1, this.height - 1, this.radius)
      }
      else {
        c.drawRect(0, 0, this.width - 1, this.height - 1)
      }
    }
    else if (this.style === 'oval') {
      c.drawCircle(0, 0, this.radius)
    }
  }

  _drawShape () {
    let c = this._shape
    c.clear()
    if (this.fill) {
      c.beginFill(this.color, this.alpha)
    }
    c.lineStyle(this.borderSize, this.borderColor, this.borderAlpha)
    this.draw()
    if (this.fill) {
      c.endFill()
    }
    c.update()
  }

  onUpdateTransform () {
    let c = this._shape
    let $ = this.$
    if (c.width !== $.width || c.height !== $.height) {
      c.width = $.width
      c.height = $.height
      c._drawShape()
    }
  }

}

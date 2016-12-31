import { Graphics } from '../pixi/graphics.js'
import { Encoder, e, d } from '../../encoder.js'


export class Shape extends Graphics {

  constructor (width = 0, height = 0) {
    super()
    this._width = width
    this._height = height
    this._fill = true
    this._fillColor = 0xFFFFFF
    this._fillAlpha = 255
    this._lineWidth = 0
    this._lineColor = 0xFFFFFF
    this._lineAlpha = 255
    this.drawShape()
  }

  get width () { return this._width }
  set width (value) {
    this._width = value
    this.drawShape()
  }

  get height () { return this._height }
  set height (value) {
    this._height = value
    this.drawShape()
  }

  get fill () { return this._fill }
  set fill (value) {
    this._fill = value
    this.drawShape()
  }

  get fillColor () { return this._fillColor }
  set fillColor (value) {
    this._fillColor = value
    this.drawShape()
  }

  get fillAlpha () { return this._fillAlpha }
  set fillAlpha (value) {
    this._fillAlpha = value
    this.drawShape()
  }

  get lineWidth () { return this._lineWidth }
  set lineWidth (value) {
    this._lineWidth = value
    this.drawShape()
  }

  get lineColor () { return this._lineColor }
  set lineColor (value) {
    this._lineColor = value
    this.drawShape()
  }

  get lineAlpha () { return this._lineAlpha }
  set lineAlpha (value) {
    this._lineAlpha = value
    this.drawShape()
  }

  draw () {
  }

  drawShape () {
    this.clear()
    this.lineStyle(this._lineWidth, this._lineColor, this._lineAlpha)
    if (this._fill) {
      this.beginFill(this._fillColor, this._fillAlpha)
    }
    this.draw()
    if (this._fill) {
      this.endFill()
    }
  }
}


Encoder.register('Shape', {
  inherit: 'Container',

  encode: obj => {
    let doc = {}
    doc.lineWidth = e('lineWidth', obj, doc)
    doc.lineColor = e('lineColor', obj, doc)
    doc.lineAlpha = e('lineAlpha', obj, doc)
    doc.fillColor = e('fillColor', obj, doc)
    doc.fillAlpha = e('fillAlpha', obj, doc)
    doc.fill = e('fill', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Shape()
    obj.lineWidth = d('lineWidth', doc, obj)
    obj.lineColor = d('lineColor', doc, obj)
    obj.lineAlpha = d('lineAlpha', doc, obj)
    obj.fillColor = d('fillColor', doc, obj)
    obj.fillAlpha = d('fillAlpha', doc, obj)
    obj.fill = d('fill', doc, obj)
    return obj
  },
})

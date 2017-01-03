import { Graphics } from '../pixi/graphics.js'
import { Encoder, e, d } from '../../lib/encoder.js'


export class Shape extends Graphics {

  constructor (width = 0, height = 0) {
    super()
    this._width = width
    this._height = height
    this._fill = true
    this._color = 0xFFFFFF
    this._alpha = 255
    this._borderSize = 0
    this._borderColor = 0xFFFFFF
    this._borderAlpha = 255
    this._drawShape()
  }

  get width () { return this._width }
  set width (value) {
    this._width = value
    this._drawShape()
  }

  get height () { return this._height }
  set height (value) {
    this._height = value
    this._drawShape()
  }

  get fill () { return this._fill }
  set fill (value) {
    this._fill = value
    this._drawShape()
  }

  get color () { return this._color }
  set color (value) {
    this._color = value
    this._drawShape()
  }

  get alpha () { return this._alpha }
  set alpha (value) {
    this._alpha = value
    this._drawShape()
  }

  get borderSize () { return this._borderSize }
  set borderSize (value) {
    this._borderSize = value
    this._drawShape()
  }

  get borderColor () { return this._borderColor }
  set borderColor (value) {
    this._borderColor = value
    this._drawShape()
  }

  get borderAlpha () { return this._borderAlpha }
  set borderAlpha (value) {
    this._borderAlpha = value
    this._drawShape()
  }

  draw () {
  }

  _drawShape () {
    this.clear()
    this.lineStyle(this._borderSize, this._borderColor, this._borderAlpha)
    if (this._fill) {
      this.beginFill(this._color, this._alpha)
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
    doc.borderSize = e('borderSize', obj, doc)
    doc.borderColor = e('borderColor', obj, doc)
    doc.borderAlpha = e('borderAlpha', obj, doc)
    doc.color = e('color', obj, doc)
    doc.alpha = e('alpha', obj, doc)
    doc.fill = e('fill', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Shape()
    obj._borderSize = d('borderSize', doc, obj)
    obj._borderColor = d('borderColor', doc, obj)
    obj._borderAlpha = d('borderAlpha', doc, obj)
    obj._color = d('color', doc, obj)
    obj._alpha = d('alpha', doc, obj)
    obj._fill = d('fill', doc, obj)
    obj._drawShape()
    return obj
  },
})

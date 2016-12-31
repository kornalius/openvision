import { Shape } from './shape.js'
import { Encoder, e, d } from '../../encoder.js'


export class Rectangle extends Shape {

  constructor (width, height) {
    super(width, height)
    this._radius = 0
    this.drawShape()
  }

  get radius () { return this._radius }
  set radius (value) {
    this._radius = value
    this.drawShape()
  }

  draw () {
    if (this.radius) {
      this.drawRoundedRect(0, 0, this.width - 1, this.height - 1, this.radius)
    }
    else {
      this.drawRect(0, 0, this.width - 1, this.height - 1)
    }
  }
}


Encoder.register('Rectangle', {
  inherit: 'Shape',

  encode: obj => {
    let doc = {}
    doc.radius = e('radius', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Rectangle()
    obj.radius = d('radius', doc, obj)
    return obj
  },
})

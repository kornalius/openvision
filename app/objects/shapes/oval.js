import { Shape } from './shape.js'
import { Encoder, e, d } from '../../encoder.js'


export class Oval extends Shape {

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
    this.drawCircle(0, 0, this.radius)
  }

}


Encoder.register('Oval', {
  inherit: 'Shape',

  encode: obj => {
    let doc = {}
    doc.radius = e('radius', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Oval()
    obj.radius = d('radius', doc, obj)
    return obj
  },
})

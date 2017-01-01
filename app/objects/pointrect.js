import { Encoder, e, d } from '../lib/encoder.js'


Encoder.register('Point', {

  encode: obj => {
    let doc = {}
    e('x', obj, doc)
    e('y', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    if (obj) {
      d('x', doc, obj)
      d('y', doc, obj)
    }
    else {
      obj = new PIXI.Point(d('x', doc, obj), d('y', doc, obj))
    }
    return obj
  },
})


Encoder.register('Rectangle', {

  encode: obj => {
    let doc = {}
    e('x', obj, doc)
    e('y', obj, doc)
    e('width', obj, doc)
    e('height', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    if (obj) {
      d('x', doc, obj)
      d('y', doc, obj)
      d('width', doc, obj)
      d('height', doc, obj)
    }
    else {
      obj = new PIXI.Rectangle(d('x', doc, obj), d('y', doc, obj), d('width', doc, obj), d('height', doc, obj))
    }
    return obj
  },
})

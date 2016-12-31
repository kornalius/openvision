import { Encoder } from '../encoder.js'


Encoder.register('Point', {

  encode: obj => {
    let doc = {
      x: obj.x,
      y: obj.y,
    }
    return doc
  },

  decode: (doc, obj) => {
    if (obj) {
      obj.x = doc.x
      obj.y = doc.y
    }
    else {
      obj = new PIXI.Point(Encoder.decode(doc.x), Encoder.decode(doc.y))
    }
    return obj
  },
})

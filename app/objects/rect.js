import { Encoder } from './encoder.js'


Encoder.register('Rectangle', {

  encode: obj => {
    let doc = {
      x: obj.x,
      y: obj.y,
      w: obj.width,
      h: obj.height,
    }
    return doc
  },

  decode: (doc, obj) => {
    if (obj) {
      obj.x = doc.x
      obj.y = doc.y
      obj.width = doc.w
      obj.height = doc.h
    }
    else {
      obj = new PIXI.Point(Encoder.decode(doc.x), Encoder.decode(doc.y), Encoder.decode(doc.w), Encoder.decode(doc.h))
    }
    return obj
  },
})

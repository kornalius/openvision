import { Encoder } from './encoder.js'


Encoder.register('BaseTexture', {

  encode: obj => {
    let doc = {
      resolution: obj.resolution,
      scaleMode: obj.scaleMode,
      premultipliedAlpha: obj.premultipliedAlpha,
      imageUrl: obj.imageUrl,
      mipmap: obj.mipmap,
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new PIXI.BaseTexture(Encoder.decode(doc.source), Encoder.decode(doc.scaleMode), Encoder.decode(doc.resolution))
    obj.premultipliedAlpha = doc.premultipliedAlpha
    obj.imageUrl = doc.imageUrl
    obj.mipmap = doc.mipmap
    return obj
  },
})


Encoder.register('Texture', {

  encode: obj => {
    let doc = {
      baseTexture: obj.baseTexture,
      frame: obj.frame,
      crop: obj.crop,
      trim: obj.trim,
      rotate: obj.rotate,
    }
    return doc
  },

  decode: (doc, obj) => obj || new PIXI.Texture(Encoder.decode(doc.baseTexture), Encoder.decode(doc.frame), Encoder.decode(doc.crop), Encoder.decode(doc.trim), Encoder.decode(doc.rotate)),
})

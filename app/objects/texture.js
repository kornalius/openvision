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
    let d = Encoder.decode(doc)
    if (obj) {
      obj.source = d.source
      obj.scaleMode = d.scaleMode
      obj.resolution = d.resolution
      obj.premultipliedAlpha = doc.premultipliedAlpha
      obj.imageUrl = doc.imageUrl
      obj.mipmap = doc.mipmap
    }
    else {
      obj = new PIXI.BaseTexture(d.source, d.scaleMode, d.resolution)
    }
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

  decode: (doc, obj) => {
    let d = Encoder.decode(doc)
    if (obj) {
      obj.baseTexture = d.baseTexture
      obj.frame = d.frame
      obj.crop = d.crop
      obj.trim = d.trim
      obj.rotate = d.rotate
    }
    else {
      obj = new PIXI.Texture(d.baseTexture, d.frame, d.crop, d.trim, d.rotate)
    }
    return obj
  },
})

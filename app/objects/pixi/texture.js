import { Encoder, e, d } from '../../encoder.js'


Encoder.register('BaseTexture', {

  encode: obj => {
    let doc = {}
    doc.resolution = e('resolution', obj, doc)
    doc.scaleMode = e('scaleMode', obj, doc)
    doc.premultipliedAlpha = e('premultipliedAlpha', obj, doc)
    doc.imageUrl = e('imageUrl', obj, doc)
    doc.mipmap = e('mipmap', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    if (obj) {
      obj.source = d('source', doc, obj)
      obj.scaleMode = d('scaleMode', doc, obj)
      obj.resolution = d('resolution', doc, obj)
      obj.premultipliedAlpha = d('premultipliedAlpha', doc, obj)
      obj.imageUrl = d('imageUrl', doc, obj)
      obj.mipmap = d('mipmap', doc, obj)
    }
    else {
      obj = new PIXI.BaseTexture(d('source', doc, obj), d('scaleMode', doc, obj), d('resolution', doc, obj))
    }
    return obj
  },
})


Encoder.register('Texture', {

  encode: obj => {
    let doc = {}
    doc.baseTexture = e('baseTexture', obj, doc)
    doc.frame = e('frame', obj, doc)
    doc.crop = e('crop', obj, doc)
    doc.trim = e('trim', obj, doc)
    doc.rotate = e('rotate', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    if (obj) {
      obj.baseTexture = d('baseTexture', doc, obj)
      obj.frame = d('frame', doc, obj)
      obj.crop = d('crop', doc, obj)
      obj.trim = d('trim', doc, obj)
      obj.rotate = d('rotate', doc, obj)
    }
    else {
      obj = new PIXI.Texture(d('baseTexture', doc, obj), d('frame', doc, obj), d('crop', doc, obj), d('trim', doc, obj), d('rotate', doc, obj))
    }
    return obj
  },
})

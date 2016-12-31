
export const encoders = {}


let getType = v => _.get(v, '$type') || _.get(v, 'constructor.name')


export class Encoder {

  static register (name, desc) {
    encoders[name] = _.extend({}, desc, { name })
  }

  static encode (obj, _default) {
    let e = encoders[getType(obj)]
    let doc = e ? e.encode(obj) : _default
    if (e && !e.primitive) {
      doc.$type = e.name
      let exceptions = e.exceptions || []
      while (e && e.inherit) {
        e = encoders[e.inherit]
        if (e) {
          _.extend(doc, _.omit(e.encode(obj), exceptions))
        }
      }
    }
    return doc
  }

  static decode (doc, _default) {
    let obj = _default
    let e = encoders[getType(doc)]
    if (e) {
      obj = e.decode(doc)
      if (!e.primitive) {
        while (e && e.inherit) {
          e = encoders[e.inherit]
          if (e) {
            e.decode(doc, obj)
          }
        }
      }
    }
    return obj
  }

}

export var e = (name, obj, doc) => Encoder.encode(obj[name], _.get(doc, name))

export var d = (name, doc, obj) => Encoder.decode(doc[name], _.get(obj, name))


Encoder.register('Object', {
  primitive: true,

  encode: obj => {
    let doc = {}
    for (let k in obj) {
      doc[k] = Encoder.encode(obj[k])
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || {}
    for (let k in doc) {
      obj[k] = Encoder.decode(doc[k])
    }
    return obj
  },
})


Encoder.register('Array', {
  primitive: true,

  encode: obj => {
    let doc = new Array(obj.length)
    for (let i = 0; i < obj.length; i++) {
      doc[i] = Encoder.encode(obj[i])
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || []
    obj.length += doc.length
    for (let i = 0; i < doc.length; i++) {
      obj[i] = Encoder.decode(doc[i])
    }
    return obj
  },
})


Encoder.register('String', {
  primitive: true,
  encode: obj => _.escape(obj),
  decode: (doc, obj) => _.unescape(doc),
})


Encoder.register('Number', {
  primitive: true,
  encode: obj => obj,
  decode: (doc, obj) => doc,
})


Encoder.register('Boolean', {
  primitive: true,
  encode: obj => obj,
  decode: (doc, obj) => doc,
})

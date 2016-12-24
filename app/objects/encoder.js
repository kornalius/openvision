
export const encoders = {}


let getType = v => _.get(v, '$type') || v.constructor.name


export class Encoder {

  static register (name, desc) {
    encoders[name] = _.extend({}, desc, { name })
  }

  static encode (obj) {
    let e = encoders[getType(obj)]
    let doc = e ? e.encode(obj) : {}
    if (e && !e.primitive) {
      doc.$type = e.name
      while (e.inherit) {
        e = encoders[e.inherit]
        _.extend(doc, e ? e.encode(obj) : {})
      }
    }
    if (_.isArray(doc)) {
      for (let i = 0; i < doc.length; i++) {
        doc[i] = Encoder.encode(doc[i])
      }
    }
    else if (_.isObject(doc)) {
      for (let k in doc) {
        doc[k] = Encoder.encode(doc[k])
      }
    }
    return doc
  }

  static decode (doc) {
    let e = encoders[getType(doc)]
    let obj = e ? e.decode(doc) : {}
    if (e && !e.primitive) {
      while (e.inherit) {
        e = encoders[e.inherit]
        if (e) {
          e.decode(doc, obj)
        }
      }
    }
    if (_.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        obj[i] = Encoder.decode(obj[i])
      }
    }
    else if (_.isObject(obj)) {
      for (let k in obj) {
        obj[k] = Encoder.decode(obj[k])
      }
    }
    return obj
  }

}


Encoder.register('Object', {
  primitive: true,

  encode: obj => {
    let doc = { $type: 'Object' }
    for (let k in obj) {
      doc[k] = obj[k]
    }
    return doc
  },

  decode: doc => {
    let obj = {}
    for (let k in doc) {
      obj[k] = doc[k]
    }
    return obj
  },
})


Encoder.register('Array', {
  primitive: true,

  encode: obj => {
    let doc = new Array(obj.length)
    for (let i = 0; i < obj.length; i++) {
      doc[i] = obj[i]
    }
    return doc
  },

  decode: doc => {
    let obj = new Array(doc.length)
    for (let i = 0; i < doc.length; i++) {
      obj[i] = doc[i]
    }
    return obj
  },
})


Encoder.register('String', {
  primitive: true,
  encode: obj => _.escape(obj),
  decode: doc => _.unescape(doc),
})


Encoder.register('Number', {
  primitive: true,
  encode: obj => obj,
  decode: doc => doc,
})


Encoder.register('Boolean', {
  primitive: true,
  encode: obj => obj,
  decode: doc => doc,
})

import { Range } from './range.js'
import { Encoder, e, d } from './encoder.js'
import { Emitter } from '../event.js'


export const MARKER_NORMAL = 0
export const MARKER_RECT = 1


export class Marker extends Range {

  constructor (parent, options = {}) {
    super(options)

    this._parent = parent
    this._id = _.uniqueId()
  }

  get id () { return this._id }

  _normalize (start, end) {
    if (start instanceof Marker) {
      end = start.end
      start = start.start
    }
    return [start, end]
  }

  union (start, end) {
    let u = super.union(...this._normalize(start, end))
    if (u) {
      this.start = u.start
      this.end = u.end
    }
    return this
  }

  subtract (start, end) {
    let a = super.subtract(...this._normalize(start, end))
    if (a) {
      if (a.length === 0) {
        this._parent.remove(this)
      }
      else {
        this.start = a[0].start
        this.end = a[0].end
        if (a.length >= 1) {
          this._parent.add(a[1].start, a[1].end)
        }
      }
    }
    return this
  }

}


export class Markers extends Emitter {

  constructor (options = {}) {
    super()

    this._list = []
  }

  get list () { return this._list }

  get length () { return this._list.length }

  add (start, end) {
    this._list.push(new Marker(this, { start, end, type: MARKER_NORMAL }))
    return this
  }

  addRect (start, end) {
    this._list.push(new Marker(this, { start, end, type: MARKER_RECT }))
    return this
  }

  find (id) {
    return _.find(this._list, { id })
  }

  remove (id) {
    _.pullAllBy(this._list, [ { id } ], 'id')
  }

  clear () {
    this._list = []
    return this
  }

  removeEmptys () {
    this._list = _.filter(this._list, m => !m.isEmpty)
    return this
  }

  intersects (start, end) {
    let l = []
    for (let m of this._list) {
      if (m.intersect(start, end)) {
        l.push(m)
      }
    }
    return l
  }

}


Encoder.register('Markers', {
  inherit: 'Ranges',

  encode: obj => {
    let doc = {}
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Markers()
    return obj
  },
})


Encoder.register('Marker', {
  inherit: 'Range',

  encode: obj => {
    let doc = {}
    e('id', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Marker()
    d('id', doc, obj, true)
    return obj
  },
})

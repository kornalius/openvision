import { Point, Rectangle } from 'rectangular'
import { Encoder, e, d } from './encoder.js'


export const RANGE_NORMAL = 0
export const RANGE_RECT = 1


export class Range extends PIXI.utils.EventEmitter {

  static Empty (type) {
    switch (type) {
      case RANGE_RECT:
        return new Range(null, { start: this.defaultStart, end: this.defaultEnd, type: RANGE_RECT })
      default:
        return new Range(null, { start: -1, end: -1, type: RANGE_NORMAL })
    }
  }

  constructor (parent, options = {}) {
    super()

    this._parent = parent
    this._rectangle = null

    this._start = _.get(options, 'start', this.emptyStart)
    this._end = _.get(options, 'end', this.emptyStart)
    this._type = _.get(options, 'type', RANGE_NORMAL)
    this._fixed = _.get(options, 'fixed', false)
  }

  get length () {
    switch (this._type) {
      case RANGE_RECT:
        return this.rectangle.area
      default:
        return this.end - this.start + 1
    }
  }

  get defaultStart () {
    switch (this._type) {
      case RANGE_RECT:
        return new Point(-1, -1)
      default:
        return -1
    }
  }

  get defaultEnd () {
    switch (this._type) {
      case RANGE_RECT:
        return new Point(-1, -1)
      default:
        return -1
    }
  }

  get start () { return this._start }
  set start (value) {
    this._start = value
    this._rectangle = null
  }

  get end () { return this._end }
  set end (value) {
    this._end = value
    this._rectangle = null
  }

  get fixed () { return this._fixed }
  set fixed (value) { this._fixed = value }

  get width () { return this.end.x - this.start.x }
  get height () { return this.end.y - this.start.y }

  get left () { return this.start.x }
  get top () { return this.start.y }
  get right () { return this.end.x }
  get bottom () { return this.end.y }

  get center () { return this.rectangle.center }

  get rectangle () {
    return this._rectangle || new Rectangle(this.start.x, this.start.y, this.width, this.height)
  }

  get isEmpty () { return this.length === 0 }

  _normalizeRect (start, end) {
    if (start instanceof Point && end instanceof Point) {
      return new Rectangle(start.x, start.y, end.x - start.x, end.y - start.y)
    }
    else if (start instanceof Rectangle) {
      return start
    }
    return null
  }

  _normalizePoint (value) {
    if (value instanceof Point) {
      return value
    }
    else if (value instanceof Rectangle) {
      return value.origin
    }
    return null
  }

  moveTo (start, end) {
    this.start = start
    this.end = end
    return this
  }

  moveBy (x, y) {
    switch (this._type) {
      case RANGE_RECT:
        this.start.plus(x, y)
        this.end.plus(x, y)
        break
      default:
        this.start += x
        this.end += x
        break
    }
    return this
  }

  extendBy (start, end) {
    switch (this._type) {
      case RANGE_RECT:
        this.start.plus(-start.x, -start.y)
        this.end.plus(end.x, end.y)
        break
      default:
        this.start -= start
        this.end += end
        break
    }
    return this
  }

  clear () {
    this.start = this.defaultStart
    this.end = this.defaultEnd
    return this
  }

  overlaps (start, end) {
    switch (this._type) {
      case RANGE_RECT:
        return this.rectangle.within(this._normalizeRect(start, end))
      default:
        if (start instanceof Range) {
          end = start.end
          start = start.start
        }
        return !(this.end < start || this.start > end)
    }
  }

  touches (start, end) {
    switch (this._type) {
      case RANGE_RECT:
        return this.rectangle.intersects(this._normalizeRect(start, end))
      default:
        if (start instanceof Range) {
          end = start.end
          start = start.start
        }
        return !(this.end + 1 < start || this.start - 1 > end)
    }
  }

  intersect (pos) {
    switch (this._type) {
      case RANGE_RECT:
      default:
        return this.touches(pos, pos) ? pos : -1
    }
  }

  difference (start, end) {
    switch (this._type) {
      case RANGE_RECT:
        return this.rectangle.intersect(this._normalizeRect(start, end))
      default:
        if (start instanceof Range) {
          end = start.end
          start = start.start
        }
        let s = this.start
        let e = this.end
        if (start > s) {
          s = start
        }
        if (end > e) {
          e = end
        }
        return { start: s, end: e }
    }
  }

  union (start, end) {
    switch (this._type) {
      case RANGE_RECT:
        return this.rectangle.union(this._normalizeRect(start, end))
      default:
        if (start instanceof Range) {
          end = start.end
          start = start.start
        }
        return { start: Math.min(this.start, start), end: Math.max(this.end, end) }
    }
  }

  subtract (start, end) {
    switch (this._type) {
      case RANGE_RECT:
        return null
      default:
        if (start instanceof Range) {
          end = start.end
          start = start.start
        }
        if (!this.overlaps(start, end)) {
          return null
        }
        if (start <= this.start && end >= this.end) {
          return []
        }
        if (start > this.start && end < this.end) {
          return [ { start: this.start, end: start - 1 }, { start: end + 1, end: this.end } ]
        }
        if (start <= this.start) {
          return [ { start: end + 1, end: this.end } ]
        }
        return [ { start: this.start, end: start - 1 } ]
    }
  }

}


export class Ranges extends PIXI.utils.EventEmitter {

  constructor (options = {}) {
    super()

    this._list = []
  }

  get list () { return this._list }

  get length () { return this._list.length }

  add (start, end) {
    this._list.push(new Range(this, { start, end, type: RANGE_NORMAL }))
    return this
  }

  addRect (start, end) {
    this._list.push(new Range(this, { start, end, type: RANGE_RECT }))
    return this
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


Encoder.register('Ranges', {

  encode: obj => {
    let doc = {
      list: new Array(obj.list.length)
    }
    for (let i = 0; i < obj.list.length; i++) {
      doc.list[i] = e(obj.list[i], obj, doc)
    }
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Ranges()
    obj.list = new Array(doc.list.length)
    for (let i = 0; i < doc.list.length; i++) {
      let o = d(doc.list[i], doc, obj)
      o._parent = obj
      obj.list[i] = o
    }
    return obj
  },
})


Encoder.register('Range', {

  encode: obj => {
    let doc = {}
    e('type', obj, doc)
    e('start', obj, doc)
    e('end', obj, doc)
    e('fixed', obj, doc)
    return doc
  },

  decode: (doc, obj) => {
    obj = obj || new Range()
    d('type', doc, obj)
    d('start', doc, obj)
    d('end', doc, obj)
    d('fixed', doc, obj)
    return obj
  },
})

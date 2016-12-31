import { Point, Rectangle } from 'rectangular'


export class BaseRange extends PIXI.utils.EventEmitter {

  constructor (options = {}) {
    super()

    this._start = _.get(options, 'start', this.emptyStart)
    this._end = _.get(options, 'end', this.emptyStart)
    this._fixed = _.get(options, 'fixed', false)
  }

  get start () { return this._start }
  set start (value) { this._start = value }

  get end () { return this._end }
  set end (value) { this._end = value }

  get fixed () { return this._fixed }
  set fixed (value) { this._fixed = value }

  get length () { return 0 }

  get isEmpty () { return this.length === 0 }

  moveTo (start, end) {
    this.start = start
    this.end = end
    return this
  }

  moveBy (x) {
    return this
  }

  extendBy (start, end) {
    return this
  }

  clear () {
    this.start = this.defaultStart
    this.end = this.defaultEnd
    return this
  }

  overlaps (start, end) { return false }

  touches (start, end) { return false }

  intersect (pos) { return false }

  difference (start, end) { return { start: this.defaultStart, end: this.defaultEnd } }

  union (start, end) { return { start: this.defaultStart, end: this.defaultEnd } }

  subtract (start, end) { return { start: this.defaultStart, end: this.defaultEnd } }

}


export class Range extends BaseRange {

  static Empty () { return new Range({ start: -1, end: -1 }) }

  get length () { return this.end - this.start + 1 }

  get defaultStart () { return -1 }
  get defaultEnd () { return -1 }

  moveBy (x) {
    this.start += x
    this.end += x
    return super.moveBy(x)
  }

  extendBy (start, end) {
    this.start -= start
    this.end += end
    return super.extendBy(start, end)
  }

  overlaps (start, end) {
    if (start instanceof Range) {
      end = start.end
      start = start.start
    }
    return !(this.end < start || this.start > end)
  }

  touches (start, end) {
    if (start instanceof Range) {
      end = start.end
      start = start.start
    }
    return !(this.end + 1 < start || this.start - 1 > end)
  }

  intersect (pos) { return this.touches(pos, pos) ? pos : -1 }

  difference (start, end) {
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

  union (start, end) {
    if (start instanceof Range) {
      end = start.end
      start = start.start
    }
    return { start: Math.min(this.start, start), end: Math.max(this.end, end) }
  }

  subtract (start, end) {
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


export class RectRange extends BaseRange {

  static Empty () { return new RectRange({ start: this.defaultStart, end: this.defaultEnd }) }

  constructor (options = {}) {
    super(options)

    this._rectangle = null
  }

  get defaultStart () { return new Point(-1, -1) }
  get defaultEnd () { return new Point(-1, -1) }

  set start (value) {
    this._start = value
    this._rectangle = null
  }

  set end (value) {
    this._end = value
    this._rectangle = null
  }

  get width () { return this.end.x - this.start.x }
  get height () { return this.end.y - this.start.y }

  get left () { return this.start.x }
  get top () { return this.start.y }
  get right () { return this.end.x }
  get bottom () { return this.end.y }

  get center () { return this.rectangle.center }

  get rectangle () { return this._rectangle || new Rectangle(this.start.x, this.start.y, this.width, this.height) }

  get length () { return this.rectangle.area }

  _normalizeRect (start, end) {
    if (start instanceof Point && end instanceof Point) {
      return new Rectangle(start.x, start.y, end.x - start.x, end.y - start.y)
    }
    else if (start instanceof Rectangle) {
      return start
    }
    else if (start instanceof RectRange) {
      return start.rectangle
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
    else if (value instanceof RectRange) {
      return value.rectangle.origin
    }
    return null
  }

  moveBy (x, y) {
    this.start.plus(x, y)
    this.end.plus(x, y)
    return this
  }

  extendBy (start, end) {
    this.start.plus(-start.x, -start.y)
    this.end.plus(end.x, end.y)
    return this
  }

  overlaps (start, end) {
    return this.rectangle.within(this._normalizeRect(start, end))
  }

  touches (start, end) {
    return this.rectangle.intersects(this._normalizeRect(start, end))
  }

  intersect (pos) { return this.rectangle.contains(pos) }

  difference (start, end) {
    return this.rectangle.intersect(this._normalizeRect(start, end))
  }

  union (start, end) {
    return this.rectangle.union(this._normalizeRect(start, end))
  }

  subtract (start, end) {
    return null
  }

}

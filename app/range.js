
export class Range extends PIXI.utils.EventEmitter {

  static Empty () { return new Range(-1, -1) }

  constructor (options = {}) {
    super()

    this._start = _.get(options, 'start', -1)
    this._end = _.get(options, 'end', -1)
  }

  get start () { return this._start }
  set start (value) { this._start = value }

  get end () { return this._end }
  set end (value) { this._end = value }

  get length () { return this.end - this.start + 1 }

  moveTo (start, end) {
    this.start = start
    this.end = end
    return this
  }

  moveBy (x) {
    this.start += x
    this.end += x
    return this
  }

  extendBy (start, end) {
    this.start += start
    this.end += end
    return this
  }

  isEmpty () { return this.start === -1 && this.end === -1 }

  clear () {
    this.start = -1
    this.end = -1
    return this
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

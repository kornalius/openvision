import { Range } from './range.js'


export class Marker extends Range {

  constructor (parent, options = {}) {
    super(options)

    this._parent = parent
  }

  union (start, end) {
    if (start instanceof Marker) {
      end = start.end
      start = start.start
    }
    let u = super.union(start, end)
    if (u) {
      this.start = u.start
      this.end = u.end
    }
    return this
  }

  subtract (start, end) {
    if (start instanceof Marker) {
      end = start.end
      start = start.start
    }
    let a = super.subtract(start, end)
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


export class Markers extends PIXI.utils.EventEmitter {

  constructor (options = {}) {
    super()

    this._list = []
  }

  get list () { return this._list }

  get length () { return this._list.length }

  add (start, end) {
    this._list.push(new Marker(this, { start, end }))
    return this
  }

  clear () {
    this._list = []
    return this
  }

  removeEmptys () {
    this._list = _.filter(this._list, m => !m.isEmpty())
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

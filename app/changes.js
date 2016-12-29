import { Patch, Patches } from './patch.js'


export class Checkpoint extends PIXI.utils.EventEmitter {

  constructor (parent, options) {
    super()

    this._parent = parent
    this._id = _.uniqueId()
    this._time = 0
  }

  get id () { return this._id }

  get time () { return this._time }
  set time (value) { this._time = value }

}


export class Change extends Patch {

  constructor (parent, options = {}) {
    super(options)

    this._parent = parent
    this._time = _.get(options, 'time', 0)
    this._children = []
  }

  get time () { return this._time }
  set time (value) { this._time = value }

  get children () { return this._children }

}


export class Changes extends Patches {

  constructor (options = {}) {
    super(options)

    this._list = []
    this._ptr = _.get(options, 'ptr', -1)
    this._limit = _.get(options, 'limit', -1)
    this._groupDelay = _.get(options, 'groupDelay', 1000)
    this._last = null
  }

  get limit () { return this._limit }
  set limit (value) { this._limit = value }

  get groupDelay () { return this._groupDelay }
  set groupDelay (value) { this._groupDelay = value }

  get ptr () { return this._ptr }

  get last () { return this._last }

  add (c) {
    let t = performance.now()
    if (this._last && t - this._last.time <= this._groupDelay && this._last.action === c.action) {
      c.time = t
      this._last.children.push(c)
    }
    else {
      if (this._limit !== -1 && this.length >= this._limit) {
        this._list.shift()
      }
      if (this._ptr !== this.length - 1) {
        this._list.splice(this._ptr + 1, this.length - this._ptr + 1)
      }
      this._list.push(c)
      this._last = c
      this._ptr = this.length - 1
    }
    this._last.time = t
    return this
  }

  remove (c) {
    super.remove(c)
    if (c === this._last) {
      this._last = null
    }
    return this
  }

  clear () {
    super.clear()
    this._last = null
    return this
  }

  createCheckpoint () {
    let cp = new Checkpoint()
    cp.time = performance.now()
    this._list.push(cp)
    this._last = null
    return cp
  }

  get checkpoints () {
    return _.filter(this._list, v => v instanceof Checkpoint)
  }

  checkpointIndex (checkpoint) { return this._list.indexOf(checkpoint) }

  checkpoint (id) { return _.find(this.checkpoints, { id }) }

  changesAt (ptr) {
    let l = []
    let a = this._list[ptr]
    if (!(a instanceof Checkpoint)) {
      l.push(this)
      for (let c of this.children) {
        l.push(c)
      }
    }
    return l
  }

  checkpointChanges (id) {
    let l = []
    let start = this.checkpointIndex(this.checkpoint(id))
    if (start !== -1) {
      for (let i = start + 1; i < this.length; i++) {
        let changes = this.changesAt(i)
        if (changes) {
          l = l.concat(changes)
        }
        else {
          break
        }
      }
    }
    return l
  }

  changesSinceCheckpoint (id) {
    let l = []
    let start = this.checkpointIndex(this.checkpoint(id))
    if (start !== -1) {
      for (let i = start + 1; i < this.length; i++) {
        let changes = this.changesAt(i)
        if (changes) {
          l = l.concat(changes)
        }
      }
    }
    return l
  }

  apply (changes, obj) {
    for (let c of changes) {
      c.apply(obj)
    }
    return this
  }

  get canUndo () { return this._ptr > 0 }

  undo (obj) {
    if (this.canUndo) {
      let changes = this.changesAt(this._ptr--).reverse()
      this.apply(changes, obj)
      return changes
    }
    return null
  }

  get canRedo () { return this._ptr < this.length - 1 }

  redo (obj) {
    if (this.canRedo) {
      let changes = this.changesAt(this._ptr++)
      this.apply(changes, obj)
      return changes
    }
    return null
  }

}

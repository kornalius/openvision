class Updates {

  constructor () {
    this._queue = []
  }

  get queue () { return this._queue }

  add (obj, cb, options = {}) {
    if (obj && !obj.__addedToUpdates) {
      obj.__addedToUpdates = true
      this._queue.push(_.extend({ args: [], render: false }, options, { obj, cb }))
    }
  }

  remove (obj) {
    obj.__addedToUpdates = false
    _.pullAllBy(this.queue, obj, 'obj')
  }

  clear () {
    this._queue = []
  }

}

export let updates = new Updates()

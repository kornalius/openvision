class Updates {

  constructor () {
    this._queue = []
  }

  get queue () { return this._queue }

  add (obj, options = {}) {
    if (obj && !obj.__addedToUpdates) {
      obj.__addedToUpdates = true
      this._queue.push(_.extend({ object: obj, args: [], flip: true, render: true }, options))
    }
  }

  remove (obj) {
    obj.__addedToUpdates = false
    _.pullAllBy(this.queue, obj, 'object')
  }

  clear () {
    this._queue = []
  }

}

export let updates = new Updates()

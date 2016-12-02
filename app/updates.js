
class Updates {

  constructor () {
    this._queue = []
  }

  get queue () { return this._queue }

  add (options) {
    let o = _.get(options, 'object')
    if (o && !o.__addedToUpdates) {
      o.__addedToUpdates = true
      this._queue.push(options)
    }
  }

  remove (o) {
    this._queue = _.reject(this.queue, { object: o })
    o.__addedToUpdates = false
  }

  clear () {
    this._queue = []
  }

}

export let updates = new Updates()

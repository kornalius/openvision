
export const PRE_PHASE = -1
export const CURRENT_PHASE = 0
export const POST_PHASE = 1


export class Event {

  constructor (source, target, name, args, phase) {
    this.time = performance.now()
    this.source = source
    this.target = target
    this.args = args
    this.name = name
    this.phase = phase
    this.bubbles = true
    this.stopped = false
    this.returnValue = []
  }

  stop () {
    this.stopped = true
  }

  cancelBubble () {
    this.bubbles = false
  }

}


class EventManager {

  constructor () {
    this._listeners = {}
    this._queue = []
  }

  get listeners () { return this._listeners }

  get queue () { return this._queue }

  create (target, name, fn, phase = CURRENT_PHASE) {
    let listeners = this._listeners
    if (!listeners[target]) {
      listeners[target] = {}
    }
    if (!listeners[target][name]) {
      listeners[target][name] = {}
    }
    if (!listeners[target][name][phase]) {
      listeners[target][name][phase] = []
    }
    return listeners[target][name][phase]
  }

  find (target, name, phase = CURRENT_PHASE) {
    let listeners = this._listeners
    if (listeners[target] && listeners[target][name] && listeners[target][name][phase]) {
      return listeners[target][name][phase]
    }
    else {
      return null
    }
  }

  remove (target, name, phase = CURRENT_PHASE) {
    let l = this.find(target, name, phase)
    if (l && l.length === 0) {
      let listeners = this._listeners
      delete listeners[target][name][phase]
      if (_.isEmpty(listeners[target][name])) {
        delete listeners[target][name]
        if (_.isEmpty(listeners[target])) {
          delete listeners[target]
        }
      }
    }
  }

  on (target, name, fn, phase = CURRENT_PHASE) {
    let l = this.create(target, name, fn, phase)
    l.push(fn)
    return target
  }

  off (target, name, fn, phase = CURRENT_PHASE) {
    let l = this.find(target, name, fn, phase)
    if (l) {
      _.pull(l, fn)
      this.remove(target, name, phase)
    }
    return target
  }

  _emit (e, phase) {
    if (e.args.length === 1 && _.isFunction(e.args[0].stopPropagation)) {
      _.extend(e, e.args[0])
      e.bubbles = false
      e.args = []
    }

    e.phase = phase || CURRENT_PHASE

    if (_.isUndefined(phase)) {
      this._emit(e, PRE_PHASE)
      if (!e.stopped) {
        this._emit(e, CURRENT_PHASE)
        if (!e.stopped) {
          this._emit(e, POST_PHASE)
        }
      }
      return
    }

    let l = this.find(e.source, e.name, phase)
    if (l) {
      for (let i = l.length - 1; i >= 0; i--) {
        e.returnValue.push(l[i].call(e.target, e, ...e.args))

        if (e.stopped) {
          break
        }

        if (e.bubbles && e.target.parent) {
          let old = e.target
          let p = e.target.parent
          while (p) {
            e.target = p
            this._emit(e, phase)

            if (e.stopped) {
              break
            }

            p = p.parent
          }
          e.target = old
        }
      }
    }
  }

  emit (target, name, ...args) {
    let e = new Event(target, target, name, args)
    this._queue.push(e)
    console.log(e)
  }

  emitSync (target, name, ...args) {
    let e = new Event(target, target, name, args)
    this._emit(e)
    return e.returnValue.length === 1 ? e.returnValue[0] : e.returnValue
  }

}

export const eventManager = new EventManager()


export class EventEmitter {

  on (name, fn, phase) {
    return eventManager.on(this, name, fn, phase)
  }

  off (name, fn, phase) {
    return eventManager.off(this, name, fn, phase)
  }

  emit (name, ...args) {
    return eventManager.emit(this, name, ...args)
  }

  emitSync (name, ...args) {
    return eventManager.emitSync(this, name, ...args)
  }

}

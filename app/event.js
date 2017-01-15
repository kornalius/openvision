
export class Event {

  constructor (target, name, data, bubbles = true) {
    this.__eventObject = true
    this.timeStamp = performance.now()
    this.target = target
    this.type = name
    this.data = data
    this.bubbles = bubbles
    this.stopped = false
    this.stoppedImmediate = false
  }

  stop () {
    this.stopped = true
  }

  stopImmediate () {
    this.stoppedImmediate = true
  }

  stopPropagation () {
    this.stopped = true
  }

  stopImmediatePropagation () {
    this.stoppedImmediate = true
  }

  cancelBubble () {
    this.bubbles = false
  }

}


export let EmitterMixin = Mixin(superclass => class EmitterMixin extends superclass {

  on (name, fn) {
    this._listeners = this._listeners || {}
    this._listeners[name] = this._listeners[name] || []
    this._listeners[name].push(fn)
    return this
  }

  once (name, fn) {
    this._listeners = this._listeners || {}

    let that = this
    let onceHandlerWrapper = () => {
      fn.apply(that.off(name, onceHandlerWrapper), arguments)
    }
    onceHandlerWrapper._originalHandler = fn

    return this.on(name, onceHandlerWrapper)
  }

  off (name, fn) {
    this._listeners = this._listeners || {}

    if (!this._listeners[name]) {
      return this
    }

    let list = this._listeners[name]
    let i = fn ? list.length : 0

    while (i-- > 0) {
      if (list[i] === fn || list[i]._originalHandler === fn) {
        list.splice(i, 1)
      }
    }

    if (_.isEmpty(list)) {
      delete this._listeners[name]
    }

    return this
  }

  emit (name, data) {
    this._listeners = this._listeners || {}

    if (!data || data.__eventObject !== true) {
      if (data && data.data && data.type) {
        data = data.data
      }
      data = new Event(this, name, data)
    }

    if (this._listeners[name]) {
      let listeners = _.clone(this._listeners[name])
      for (let l of listeners) {
        l.call(this, data)
        if (data.stoppedImmediate) {
          return this
        }
      }
      if (data.stopped) {
        return this
      }
    }

    if (data.bubbles && this.parent && this.parent.emit) {
      this.parent.emit(name, data)
    }

    return this
  }

})


class EmptyClass {}

export class Emitter extends mix(EmptyClass).with(EmitterMixin) {
}

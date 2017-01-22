
const TRANSITION_STOPPED = 0
const TRANSITION_PAUSED = 1
const TRANSITION_PLAYING = 2

class Transition extends app.Emitter {

  constructor (instance, prop, value, type, duration) {
    super()
    this.instance = instance
    this.$ = instance.$
    this.prop = prop
    this.oldValue = this.$[prop]
    this.newValue = value
    this.type = type
    this.duration = duration
    this.time = 0
    this.elapsed = 0
    this.handle = 0
    this.status = TRANSITION_STOPPED
    this.dist = this.newValue - this.oldValue
  }

  step () {
    let time = app.now

    this.elapsed += time - this.time

    let factor = this.elapsed / this.duration
    if (factor > 1) {
      factor = 1
    }

    if (factor !== 1) {
      this.time = time
      this.handle = app.raf(this.step.bind(this))
    }
    else {
      this.handle = 0
      return
    }

    let delta
    let value
    switch (this.equation) {
      case 'quadIn':
        delta = Math.pow(factor, 2)
        break
      case 'quadOut':
        delta = 1 - Math.pow(1 - factor, 2)
        break
      case 'cubicIn':
        delta = Math.pow(factor, 3)
        break
      case 'cubicOut':
        delta = 1 - Math.pow(1 - factor, 3)
        break
      case 'quartIn':
        delta = Math.pow(factor, 4)
        break
      case 'quartOut':
        delta = 1 - Math.pow(1 - factor, 4)
        break
      case 'expoIn':
        delta = Math.pow(2, 8 * (factor - 1))
        break
      case 'expoOut':
        delta = 1 - Math.pow(2, 8 * (1 - factor - 1))
        break
      case 'circIn':
        delta = 1 - Math.sin(Math.acos(factor))
        break
      case 'circOut':
        delta = Math.sin(Math.acos(1 - factor))
        break
      case 'sineIn':
        delta = 1 - Math.cos(factor * Math.PI / 2)
        break
      case 'sineOut':
        delta = Math.cos((1 - factor) * Math.PI / 2)
        break
      case 'bounceIn':
        for (let a = 0, b = 1; 1; a += b, b /= 2) {
          if (factor >= (7 - 4 * a) / 11) {
            value = b * b - Math.pow((11 - 6 * a - 11 * factor) / 4, 2)
            break
          }
        }
        delta = value
        break
      case 'bounceOut':
        factor = 1 - factor
        for (let a = 0, b = 1; 1; a += b, b /= 2) {
          if (factor >= (7 - 4 * a) / 11) {
            value = b * b - Math.pow((11 - 6 * a - 11 * factor) / 4, 2)
            break
          }
        }
        delta = 1 - value
        break
    }

    this.$[this.prop] += this.dist > 0 ? delta : -delta
  }

  get isPlaying () { return this.status === TRANSITION_PLAYING }
  get isPaused () { return this.status === TRANSITION_PAUSED }
  get isStopped () { return this.status === TRANSITION_STOPPED }

  remove () {
    this.stop()
    delete this.instance._transitions[this.prop]
    return this
  }

  play () {
    if (this.isStopped) {
      this.status = TRANSITION_PLAYING
      this.time = app.now
      if (this.handle) {
        app.caf(this.handle)
      }
      this.handle = app.raf(this.step.bind(this))
    }
    return this
  }

  pause () {
    if (!this.isPaused && !this.isStopped) {
      this.status = TRANSITION_PAUSED
      if (this.handle) {
        app.caf(this.handle)
      }
      this.handle = 0
    }
    return this
  }

  resume () {
    if (this.isPaused) {
      this.status = TRANSITION_PLAYING
      this.handle = app.raf(this.step.bind(this))
    }
    return this
  }

  cancel () {
    this.$[this.prop] = this.oldValue
    return this.stop()
  }

  stop () {
    this.status = TRANSITION_STOPPED
    if (this.handle) {
      app.caf(this.handle)
    }
    this.handle = 0
    return this.remove()
  }

}


export default class Transitions extends Plugin {

  constructor () {
    super()
    this.name = 'transitions'
    this.desc = 'Allow property values to transition over time to new values.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      transitions: { value: {} },
    }
  }

  find (prop) { return this._transitions[prop] }

  create (prop, newValue, duration, type) {
    let t = this.find(prop)
    let oldValue = this[prop]
    if (!t && oldValue !== newValue) {
      t = new Transition(this, prop, newValue, type, duration)
      this._transitions[prop] = t
    }
    return t.play()
  }

  remove (prop) {
    let t = this.find(prop)
    if (t) {
      t.remove()
    }
    return this
  }

  isPlaying (prop) {
    let t = this.find(prop)
    return t && t.isPlaying
  }

  isPaused (prop) {
    let t = this.find(prop)
    return t && t.isPaused
  }

  play (prop) {
    let t = this.find(prop)
    if (t) {
      t.play()
    }
    return this
  }

  pause (prop) {
    let t = this.find(prop)
    if (t) {
      t.pause()
    }
    return this
  }

  resume (prop) {
    let t = this.find(prop)
    if (t) {
      t.resume()
    }
    return this
  }

  cancel (prop) {
    let t = this.find(prop)
    if (t) {
      this.cancel()
    }
    return this
  }

  stop (prop) {
    let t = this.find(prop)
    if (t) {
      t.stop()
    }
    return this.remove(prop)
  }

  playAll () {
    for (let k in this._transitions) {
      this._transitions[k].play()
    }
    return this
  }

  pauseAll () {
    for (let k in this._transitions) {
      this._transitions[k].pause()
    }
    return this
  }

  resumeAll () {
    for (let k in this._transitions) {
      this._transitions[k].resume()
    }
    return this
  }

  stopAll () {
    for (let k in this._transitions) {
      this._transitions[k].stop()
    }
    return this
  }

  cancelAll () {
    for (let k in this._transitions) {
      this._transitions[k].cancel()
    }
    return this
  }

  removeAll () {
    for (let k in this._transitions) {
      this._transitions[k].remove()
    }
    return this
  }

}

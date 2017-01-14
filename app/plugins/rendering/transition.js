
export default class Transition extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'transition'
    this._desc = 'Allow transitioning over time container\'s property value.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/13/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._transitions = {}
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._transitions
    }
  }

  stepTransition () {
    let time = app.now

    this.elapsed += time - this.time

    let factor = this.elapsed / this.duration
    if (factor > 1) {
      factor = 1
    }

    if (factor !== 1) {
      this.time = time
      this.handle = app.raf(this.obj.stepTransition.bind(this))
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

    this.obj[this.property] += this.dist > 0 ? delta : -delta
  }

  findTransition (property) { return this._transitions[property] }

  transition (property, newValue, duration, equation) {
    let t = this.findTransition(property)
    let oldValue = this[property]
    if (!t && oldValue !== newValue) {
      t = {
        obj: this,
        oldValue,
        newValue,
        duration,
        time: 0,
        elapsed: 0,
        equation,
        dist: newValue - oldValue
      }
      this._transitions[property] = t
    }
    this.playTransition(property)
    return t
  }

  removeTransition (property) {
    this.stopTransition(property)
    delete this._transitions[property]
    return this
  }

  isTransitionPlaying (property) {
    let t = this.findTransition(property)
    return t ? t.status === 1 : false
  }

  isTransitionPaused (property) {
    let t = this.findTransition(property)
    return t ? t.status === 0 : false
  }

  playTransition (property) {
    let t = this.findTransition(property)
    if (t && !this.isTransitionPlaying(property)) {
      t.status = 1
      t.time = app.now
      if (t.handle) {
        app.caf(t.handle)
      }
      t.handle = app.raf(this.stepTransition.bind(t))
    }
    return this
  }

  pauseTransition (property) {
    let t = this.findTransition(property)
    if (t && !this.isTransitionPaused(property)) {
      t.status = 0
      if (t.handle) {
        app.caf(t.handle)
      }
      t.handle = 0
    }
    return this
  }

  resumeTransition (property) {
    let t = this.findTransition(property)
    if (t && this.isTransitionPaused(property)) {
      t.status = 1
      t.handle = app.raf(this.stepTransition.bind(t))
    }
    return this
  }

  cancelTransition (property) {
    let t = this.findTransition(property)
    if (t) {
      this[property] = t.oldValue
    }
    return this.stopTransition(property)
  }

  stopTransition (property) {
    let t = this.findTransition(property)
    if (t) {
      if (t.handle) {
        app.caf(t.handle)
      }
      t.handle = 0
    }
    return this.removeTransition(property)
  }

  playAllTransitions () {
    for (let property in this._transitions) {
      this.playTransition(property)
    }
    return this
  }

  pauseAllTransitions () {
    for (let property in this._transitions) {
      this.pauseTransition(property)
    }
    return this
  }

  resumeAllTransitions () {
    for (let property in this._transitions) {
      this.resumeTransition(property)
    }
    return this
  }

  stopAllTransitions () {
    for (let property in this._transitions) {
      this.stopTransition(property)
    }
    return this
  }

  cancelAllTransitions () {
    for (let property in this._transitions) {
      this.cancelTransition(property)
    }
    return this
  }

  removeAllTransitions () {
    for (let property in this._transitions) {
      this.removeTransition(property)
    }
    return this
  }

}

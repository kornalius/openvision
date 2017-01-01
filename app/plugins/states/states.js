
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'states'
    this._desc = 'Add states functions to a container.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/14/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
    this._states = {}
  }

  unload (obj) {
    super.unload(obj)
    delete this._states
  }

  addState (state) {
    if (_.isString(state) && !this.hasState(state)) {
      this._states[state] = true
    }
    else if (_.isArray(state)) {
      for (let s of state) {
        this.addState(s)
      }
    }
    else if (_.isObject(state)) {
      for (let k in state) {
        if (state[k] !== false) {
          this.addState(k)
        }
      }
    }
    return this
  }

  removeState (state) {
    if (_.isString(state) && this.hasState(state)) {
      delete this._states[state]
    }
    else if (_.isArray(state)) {
      for (let s of state) {
        this.removeState(s)
      }
    }
    else if (_.isObject(state)) {
      for (let k in state) {
        if (state[k] !== false) {
          this.addState(k)
        }
      }
    }
    return this
  }

  hasState (state) {
    if (_.isString(state)) {
      return _.isObject(this._states) && this._states[state] === true
    }
    else if (_.isArray(state)) {
      for (let s of state) {
        if (!this.hasState(s)) {
          return false
        }
      }
      return true
    }
    else if (_.isObject(state)) {
      for (let k in state) {
        if (state[k] !== false) {
          if (!this.hasState(k)) {
            return false
          }
        }
      }
      return true
    }
    return false
  }

  toggleState (state) {
    return this.setState(state, !this.hasState(state))
  }

  setState (state, value) {
    if (value === true) {
      this.addState(state)
    }
    else if (value === false) {
      this.removeState(state)
    }
    return this
  }

}

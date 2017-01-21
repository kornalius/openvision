
export default class States extends Plugin {

  constructor () {
    super()
    this.name = 'states'
    this.desc = 'Add states functions to a container.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      states: { value: {} },
    }
  }

  add (state) {
    if (_.isString(state) && !this.has(state)) {
      this._states[state] = true
    }
    else if (_.isArray(state)) {
      for (let s of state) {
        this.add(s)
      }
    }
    else if (_.isObject(state)) {
      for (let k in state) {
        if (state[k] !== false) {
          this.add(k)
        }
      }
    }
    return this.owner
  }

  remove (state) {
    if (_.isString(state) && this.has(state)) {
      delete this._states[state]
    }
    else if (_.isArray(state)) {
      for (let s of state) {
        this.remove(s)
      }
    }
    else if (_.isObject(state)) {
      for (let k in state) {
        if (state[k] !== false) {
          this.add(k)
        }
      }
    }
    return this.owner
  }

  has (state) {
    if (_.isString(state)) {
      return _.isObject(this._states) && this._states[state] === true
    }
    else if (_.isArray(state)) {
      for (let s of state) {
        if (!this.has(s)) {
          return false
        }
      }
      return true
    }
    else if (_.isObject(state)) {
      for (let k in state) {
        if (state[k] !== false) {
          if (!this.has(k)) {
            return false
          }
        }
      }
      return true
    }
    return false
  }

  toggle (state) {
    return this.set(state, !this.has(state))
  }

  set (state, value) {
    if (value === true) {
      this.add(state)
    }
    else if (value === false) {
      this.remove(state)
    }
    return this.owner
  }

  query (state, arr) {
    return _.filter(arr, a => a.has && a.has(state))
  }

}

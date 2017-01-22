
export default class Disabled extends Plugin {

  constructor () {
    super()
    this.name = 'disabled'
    this.desc = 'Allow container to be disabled.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.properties = {
      disabled: { value: true, update: true },
    }
  }

  disable () {
    if (!this._disabled) {
      this.disabled = true
    }
    return this
  }

  enable () {
    if (this._disabled) {
      this.disabled = false
    }
    return this
  }

}

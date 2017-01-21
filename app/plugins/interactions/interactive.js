
export default class Interactive extends Plugin {

  constructor () {
    super()
    this.name = 'interactive'
    this.desc = 'Allow container to be interacted with the mouse or touch.'
    this.author = 'Alain Deschenes'
    this.version = '1.0.0'
    this.nolink = true
  }

  init (owner, options = {}) {
    owner.interactive = true
    owner.buttonMode = true
    this._oldDefaultCursor = owner.defaultCursor
    owner.defaultCursor = 'default'
  }

  destroy (owner) {
    owner.interactive = false
    owner.buttonMode = false
    owner.defaultCursor = this._oldDefaultCursor
  }

}

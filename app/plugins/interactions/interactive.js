
export default class Interactive extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'interactive'
    this._desc = 'Allow container to be interacted with the mouse or touch.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/17/2017'
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj.interactive = true
      obj.buttonMode = true
      obj._oldDefaultCursor = obj.defaultCursor
      obj.defaultCursor = 'default'
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      obj.interactive = false
      obj.buttonMode = false
      obj.defaultCursor = obj._oldDefaultCursor
      delete obj._oldDefaultCursor
    }
  }

}

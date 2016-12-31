
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'control'
    this._desc = 'Allow a container to act as a control.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/31/2016'
    this._deps = ['interactive', 'mouse', 'keyboard', 'disabled', 'focusable', 'renderable']
  }

  load (obj, options = {}) {
    super.load(obj, options)
  }

  unload (obj) {
    super.unload(obj)
  }

}

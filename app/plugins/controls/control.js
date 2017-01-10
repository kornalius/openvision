
export default class Control extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'control'
    this._desc = 'Allow a container to act as a control.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.1'
    this._date = '01/07/2017'
    this._deps = ['interactive', 'mouse', 'keyboard', 'disabled', 'focusable', 'hover', 'renderable']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
    }
  }

}

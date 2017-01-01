
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'keyboard'
    this._desc = 'Allow container to accept keyboard events.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/16/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj.tabIndex = 1
    obj._onKeyDown = obj.onKeyDown.bind(obj)
    obj._onKeyUp = obj.onKeyUp.bind(obj)
    window.addEventListener('keydown', obj._onKeyDown, false)
    window.addEventListener('keyup', obj._onKeyUp, false)
  }

  unload (obj) {
    window.removeEventListener('keydown', obj._onKeyDown, false)
    window.removeEventListener('keyup', obj._onKeyUp, false)
    delete obj._onKeyDown
    delete obj._onKeyUp
    super.unload(obj)
  }

  onKeyDown (e) {
    if (this.focused) {
      // console.log('down', e)
    }
  }

  onKeyUp (e) {
    if (this.focused) {
      // console.log('up', e)
    }
  }

}
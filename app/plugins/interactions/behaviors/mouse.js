
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'mouse'
    this._desc = 'Allow container to be interacted with the mouse.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/16/2016'
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj._pressed = {}
    obj.on('mousedown', obj.onMouseDown)
    obj.on('mousemove', obj.onMouseMove)
    obj.on('mouseup', obj.onMouseUp)
  }

  unload (obj) {
    delete obj._pressed
    obj.off('mousedown', obj.onMouseDown)
    obj.off('mousemove', obj.onMouseMove)
    obj.off('mouseup', obj.onMouseUp)
    super.unload(obj)
  }

  onMouseDown (e) {
    let info = app.mouseInfo(e)
    if (info.leftButton) {
      this._pressed.down = info
    }
  }

  onMouseMove (e) {
  }

  onMouseUp (e) {
    this._pressed = {}
  }

}

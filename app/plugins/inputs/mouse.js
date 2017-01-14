
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'mouse'
    this._desc = 'Allow container to be interacted with the mouse.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/07/2017'
    this._deps = ['interactive']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj._pressed = {}
      obj.on('mousedown', obj.onMouseDown)
      obj.on('mousemove', obj.onMouseMove)
      obj.on('mouseup', obj.onMouseUp)
      obj.on('mouseupoutside', obj.onMouseUp)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      delete obj._pressed
      obj.off('mousedown', obj.onMouseDown)
      obj.off('mousemove', obj.onMouseMove)
      obj.off('mouseup', obj.onMouseUp)
      obj.off('mouseupoutside', obj.onMouseUp)
    }
  }

  onMouseDown (e) {
    let info = app.mouseEvent(e)
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

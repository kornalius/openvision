
export default class Movable extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'movable'
    this._desc = 'Allow container to be moved around with the mouse.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '01/12/2017'
    this._deps = ['interactive', 'mouse', 'keyboard', 'align', 'layout', 'tile']
  }

  load (obj, options = {}) {
    if (super.load(obj, options)) {
      obj.on('mousemove', obj.onMouseMoveMovable)
    }
  }

  unload (obj) {
    if (super.unload(obj)) {
      obj.off('mousemove', obj.onMouseMoveMovable)
    }
  }

  onMouseMoveMovable (e) {
    let info = app.mouseEvent(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let x = info.sx - this._pressed.down.x
        let y = info.sy - this._pressed.down.y
        if (this.x !== x) {
          this.x = x
          this.update()
        }
        if (this.y !== y) {
          this.y = y
          this.update()
        }
      }
    }
  }

}

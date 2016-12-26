
export default class extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'movable'
    this._desc = 'Allow container to be moved around with the mouse.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/04/2016'
    this._deps = ['interactive', 'mouse', 'keyboard']
  }

  load (obj, options = {}) {
    super.load(obj, options)
    obj.on('mousemove', obj.onMouseMoveMovable)
  }

  unload (obj) {
    obj.off('mousemove', obj.onMouseMoveMovable)
    super.unload(obj)
  }

  onMouseMoveMovable (e) {
    let info = app.mouseEvent(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let x = info.sx - this._pressed.down.x
        let y = info.sy - this._pressed.down.y
        if (this.position.x !== x) {
          this.position.x = x
          this.update()
        }
        if (this.position.y !== y) {
          this.position.y = y
          this.update()
        }
      }
    }
  }

}

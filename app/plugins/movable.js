
export class MovableClass extends Plugin {

  constructor (options = {}) {
    super(options)
    this._name = 'movable'
    this._desc = 'Allow container to be moved around with the mouse.'
    this._author = 'Alain Deschenes'
    this._version = '1.0.0'
    this._date = '12/04/2016'
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

}


export let MovableMixin = Mixin(superclass => class MovableMixin extends superclass {

  onMouseDown (e) {
    let info = app.mouseInfo(e)
    if (info.leftButton) {
      this._pressed.down = info
    }
  }

  onMouseMove (e) {
    let info = app.mouseInfo(e)
    if (info.target === this) {
      if (this._pressed.down) {
        let x = info.x - this._pressed.down.dx
        let y = info.y - this._pressed.down.dy
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

  onMouseUp (e) {
    this._pressed = {}
  }

})

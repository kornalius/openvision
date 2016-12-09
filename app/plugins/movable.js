
export let C = class extends Plugin {

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


export let M = Mixin(superclass => class extends superclass {

  onMouseDown (e) {
    if (e.data.originalEvent.button === 0) {
      this._pressed.down = { time: Date.now(), x: e.data.global.x, y: e.data.global.y, button: e.data.originalEvent.button }
      this._pressed.move = _.clone(this._pressed.down)
    }
  }

  onMouseMove (e) {
    if (this._pressed.down) {
      let x = e.data.global.x
      let y = e.data.global.y
      let dx = x - this._pressed.move.x
      let dy = y - this._pressed.move.y
      this.position.x += dx
      this.position.y += dy
      this.update()
    }
    this._pressed.move = { time: Date.now(), x: e.data.global.x, y: e.data.global.y, button: e.data.originalEvent.button }
  }

  onMouseUp (e) {
    delete this._pressed.down
    delete this._pressed.move
  }

})

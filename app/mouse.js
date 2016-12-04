import { Base } from './objects/base.js'

export default class Mouse extends Base {

  constructor (main) {
    super()

    this._main = main

    this._x = 0
    this._y = 0
    this._btns = 0

    this._sprite = new PIXI.Sprite()

    let stage = main.stage
    if (stage) {
      stage.interactive = true

      stage.on('mousedown', this.onMouseDown.bind(this))
      stage.on('rightdown', this.onMouseDown.bind(this))
      stage.on('touchstart', this.onMouseDown.bind(this))

      stage.on('mousemove', this.onMouseMove.bind(this))

      stage.on('mouseup', this.onMouseUp.bind(this))
      stage.on('touchend', this.onMouseUp.bind(this))
      stage.on('mouseupoutside', this.onMouseUp.bind(this))
      stage.on('touchendoutside', this.onMouseUp.bind(this))
    }
  }

  get x () { return this._x }
  get y () { return this._y }
  get btns () { return this._btns }

  set x (value) {
    this._x = value
  }

  set y (value) {
    this._y = value
  }

  set btns (value) {
    this._btns = value
  }

  getEventInfo (e) {
    let renderer = this._main.renderer

    let size = new PIXI.Point(renderer.width - this._sprite.width, renderer.height - this._sprite.height)

    let x = Math.trunc(Math.min(size.x, Math.max(0, e.data.global.x)) / this._main.scale)
    let y = Math.trunc(Math.min(size.y, Math.max(0, e.data.global.y)) / this._main.scale)

    return { x, y, button: e.data.originalEvent.button }
  }

  onMouseDown (e) {
    let { x, y, button } = this.getEventInfo(e)

    switch (button) {
      case 0: // left
        this._btns |= 0x01
        break

      case 1: // middle
        this._btns |= 0x02
        break

      case 2: // right
        this._btns |= 0x04
        break
    }

    this.emit('mouse.down', { x, y, button })

    e.stopPropagation()
  }

  onMouseUp (e) {
    let { x, y, button } = this.getEventInfo(e)

    switch (button) {
      case 0: // left
        this._btns &= ~0x01
        break

      case 1: // middle
        this._btns &= ~0x02
        break

      case 2: // right
        this._btns &= ~0x04
        break
    }

    this.emit('mouse.up', { x, y, button })

    e.stopPropagation()
  }

  onMouseMove (e) {
    let { x, y, button } = this.getEventInfo(e)

    this._x = x
    this._y = y

    this.emit('mouse.move', { x, y, button })

    this._main.refresh()

    e.stopPropagation()
  }
}
